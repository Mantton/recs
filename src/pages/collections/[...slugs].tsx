import { api } from "@/utils/api";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
import { LoadingSpinner } from "@/components/loading";
import { prisma } from "@/server/db";
import Head from "next/head";
import { dateString } from "@/utils/data";
import NSFWTag from "@/components/NSFWTag";
import Link from "next/link";
import Image from "next/image";
import MangaTile, { MediaInfoContext } from "@/components/MangaTile";
import type { AnilistIDMedia } from "@/types";
import { getAnilistMediaInfo } from "@/utils/anilist";
import ActionButtons from "@/components/ActionButtons";
export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, currentUser: undefined },
    transformer: superjson,
  });
  const slugs = ctx.query.slugs;
  const collectionId =
    typeof slugs === "object" && Array.isArray(slugs) && slugs?.[0]
      ? parseInt(slugs[0])
      : undefined;

  const exists = await helpers.collection.doesCollectionExist.fetch({
    id: collectionId,
  });

  if (!exists || !collectionId) {
    return {
      props: {
        collectionId,
      },
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
      collectionId,
    },
  };
};

type SSP = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SingleCollectionPage(props: SSP) {
  const { collectionId } = props;
  const { data, isLoading, status } = api.collection.getCollection.useQuery({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    id: collectionId,
  });

  if (status !== "success" || isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) return <LoadingSpinner></LoadingSpinner>;
  const { title, dateCreated, description, adultContent, author, tags, manga } =
    data;
  const tagClassName =
    "rounded-md bg-slate-100 px-2 py-[3px] text-sm text-gray-700 transition-colors hover:bg-slate-300 md:text-xs";
  const cache: Record<number, AnilistIDMedia> = {};
  const getMediaInfo = async (id: number) => {
    let d = cache[id];
    if (d) return d;
    d = await getAnilistMediaInfo(id);
    cache[id] = d;
    return d;
  };
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description ?? title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-extrabold tracking-wide">{title}</h1>
              {adultContent && <NSFWTag />}
            </div>
            <div className="px-4">
              <ActionButtons collection={data} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className=" flex items-center gap-2">
              <Link href={`/account/${author.username}`}>
                <div className="relative flex h-5 w-5">
                  <Image
                    src={author.profileImage}
                    alt={author.username}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link href={`/account/${author.username}`}>
                  <p className="font-light leading-tight text-slate-800 hover:underline">
                    {author.username}
                  </p>
                </Link>
              </div>
            </div>
            <span>•</span>
            <p className="font-light text-gray-700">
              {dateString(dateCreated)}
            </p>
          </div>
        </div>
        <div>
          <div>
            <div className="my-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link href={`/recs?t=${tag}`} key={tag}>
                  <p className={tagClassName}>{tag}</p>
                </Link>
              ))}
            </div>

            {description && (
              <span className="text-sm font-light text-gray-800">
                {description}
              </span>
            )}
          </div>
        </div>
        {manga?.[0] && (
          <MediaInfoContext.Provider value={{ getMediaInfo }}>
            <div className="grid grid-cols-3 gap-2 pt-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
              {manga.map((m, i) => (
                <div
                  className="aspect-w-2 aspect-h-3 rounded-md bg-slate-100"
                  key={i}
                >
                  <MangaTile manga={m} />
                </div>
              ))}
            </div>
          </MediaInfoContext.Provider>
        )}
        {!manga?.[0] && (
          <div className="flex flex-1 justify-center p-4">
            <p className="text-md font-thin">No Manga In this Collection</p>
          </div>
        )}
      </div>
    </>
  );
}
