import type { SerializedCollection } from "@/server/api/utils/serializers";
import Image from "next/image";
import Link from "next/link";
import type { Manga } from "@prisma/client";
import { slug } from "@/utils/slug";
import TagList from "../TagList";
import MangaTile from "../MangaTile";
import { dateString } from "@/utils/data";
import ActionButtons from "../ActionButtons";

const MangaComponent = ({ manga, link }: { manga: Manga[]; link: string }) => {
  const exceedsCells = manga.length > 8;
  const excessCount = manga.length - 8;
  const selection = new Array(8).fill(undefined).map((_, i) => manga[i]);
  return (
    <div className="">
      <div className="grid grid-cols-4 gap-2">
        {selection.map((m, i) => {
          return (
            <div
              className="aspect-w-2 aspect-h-3 rounded-md bg-slate-100"
              key={i}
            >
              {m && <MangaTile manga={m} key={m.id} />}
            </div>
          );
        })}
      </div>
      {exceedsCells && (
        <div className="flex justify-end">
          <Link href={link}>
            <p className="px-2 pt-2 text-xs font-semibold text-slate-500 hover:underline">
              +{excessCount} More
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default function CollectionView(props: SerializedCollection) {
  const {
    author,
    description,
    title,
    id,
    dateCreated,
    tags,
    manga,
    lastUpdated,
  } = props;
  const relativeDate = dateString(dateCreated);
  const link = `/collections/${id}/${slug(title)}`;
  return (
    <>
      <div className="flex flex-col gap-2 rounded-md border-[1px] border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className=" flex items-center gap-2">
            <Link href={`/account/${author.username}`}>
              <div className="relative flex h-10 w-10">
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
                <p className="text-sm font-semibold leading-tight text-slate-800 hover:underline">
                  {author.username}
                </p>
              </Link>
              <p className="text-xs font-light italic leading-tight tracking-tight text-gray-600">
                {relativeDate}
                {lastUpdated && (
                  <span>• last updated {dateString(lastUpdated)}</span>
                )}
              </p>
            </div>
          </div>
          <ActionButtons collection={props} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href={link}
              className="hover:underline hover:underline-offset-4"
            >
              <p className="text-lg font-semibold">{title}</p>
            </Link>
            {description && (
              <p className="text-sm font-light text-gray-400 md:text-xs">
                {description}
              </p>
            )}
          </div>
        </div>
        {tags[0] && <TagList tags={tags} link={link} />}
        {!manga[0] && (
          <p className="flex flex-1 items-center justify-center p-4 text-center text-gray-400">
            No manga in this collection
          </p>
        )}
        {manga[0] && <MangaComponent manga={manga} link={link} />}
      </div>
    </>
  );
}
