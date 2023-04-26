import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import type { SerializedCollection } from "@/server/api/utils/serializers";
import type { AnilistIDMedia } from "@/types";
import { getAnilistMediaInfo } from "@/utils/anilist";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CollectionView from "@/components/collection/CollectionView";
import { MediaInfoContext } from "@/components/MangaTile";
import { LoadingPage, LoadingSpinner } from "@/components/loading";
import CollectionSorter from "@/components/SortPicker";

const BuildGrid = ({ data }: { data: SerializedCollection[] }) => {
  return (
    <div
      id="collections"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {data.map((c) => (
        <CollectionView {...c} key={c.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { query, isReady } = useRouter();

  const mangaId =
    query.m && typeof query.m === "string" && !Number.isNaN(Number(query.m))
      ? Number(query.m)
      : undefined;
  const tagId = query.t && typeof query.t === "string" ? query.t : undefined;
  const asc =
    query.asc && typeof query.asc === "string"
      ? query.asc === "true"
      : undefined;
  const [sort, setSort] = useState(
    query.s && typeof query.s === "string" ? query.s : "favorites"
  );

  const { data, isLoading } = api.collection.getCollections.useInfiniteQuery({
    mangaId,
    tagId,
    sort,
    asc,
  });

  const [mangaInfo, setMangaInfo] = useState<AnilistIDMedia | null>(null);
  const cache: Record<number, AnilistIDMedia> = {};

  const getMediaInfo = async (id: number) => {
    let d = cache[id];
    if (d) return d;
    d = await getAnilistMediaInfo(id);
    cache[id] = d;
    return d;
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }
  }, [isReady]);

  useEffect(() => {
    if (!mangaId) return;

    const fetchMangaInfo = async () => {
      const data = await getAnilistMediaInfo(mangaId);
      setMangaInfo(data);
    };

    void fetchMangaInfo();
  }, [mangaId]);

  return (
    <>
      <Head>
        <title>Recs</title>
        <meta
          name="description"
          content="Manga/Manhwa recommendations made easy!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div>{(isLoading || !isReady) && <LoadingPage />}</div>
        {data && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="header w-3/4 text-xl font-extrabold tracking-wide sm:text-2xl md:text-3xl">
                {tagId && <span>{tagId} Collections</span>}
                {mangaId && (
                  <div>
                    {!mangaInfo && <LoadingSpinner />}
                    {mangaInfo && (
                      <span>
                        &quot;{mangaInfo.title.userPreferred}&quot; Collections
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pl-4">
                <CollectionSorter ss={{ value: sort, dispatch: setSort }} />
              </div>
            </div>
            <MediaInfoContext.Provider value={{ getMediaInfo }}>
              <BuildGrid data={data.pages.flat()} />
            </MediaInfoContext.Provider>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
