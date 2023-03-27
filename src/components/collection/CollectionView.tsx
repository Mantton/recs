import type { SerializedCollection } from "@/server/api/utils/serializers";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Manga } from "@prisma/client";
import { slug } from "@/utils/slug";
import { HiOutlineBookmark, HiOutlineHeart } from "react-icons/hi";
import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";

dayjs.extend(relativeTime);

const ActionButtons = ({
  collection,
}: {
  collection: SerializedCollection;
}) => {
  const { isBookmarked, isFavorite, bookmarks, favorites } = collection;
  const [bookmark, setBookmark] = useState(isBookmarked);
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleState = (
    dispatch: Dispatch<SetStateAction<boolean>>,
    value: boolean
  ) => {
    dispatch(!value);
  };
  return (
    <>
      <div className="flex gap-4 md:gap-3">
        <button onClick={() => toggleState(setBookmark, bookmark)}>
          <HiOutlineBookmark
            className={clsx({
              ["h-[1.25rem] w-[1.25rem] text-slate-400 transition-colors duration-300"]:
                true,
              ["hover:text-slate-600"]: !bookmark,
              ["fill-current"]: bookmark,
            })}
          />
        </button>
        <button onClick={() => toggleState(setFavorite, favorite)}>
          <HiOutlineHeart
            className={clsx({
              ["h-[1.25rem] w-[1.25rem] text-slate-500 transition-colors duration-300 hover:text-red-400"]:
                true,
              ["fill-current text-red-400"]: favorite,
            })}
          />
        </button>
      </div>
    </>
  );
};
const TagsComponent = ({ tags, link }: { tags: string[]; link: string }) => {
  const tagClassName =
    "rounded-md bg-slate-100 px-2 py-[3px] text-sm text-gray-700 transition-colors hover:bg-slate-300 md:text-xs";
  return (
    <>
      <div className="my-2 flex flex-wrap gap-2">
        {tags.slice(0, 6).map((tag) => (
          <a
            href={`https://anilist.co/search/manga?genres=${tag}`}
            key={tag}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className={tagClassName}>{tag}</p>
          </a>
        ))}
        {tags.length > 6 && (
          <Link href={link}>
            <p className={tagClassName}>+ {tags.length - 6} more</p>
          </Link>
        )}
      </div>
    </>
  );
};

const MangaComponent = ({ manga, link }: { manga: Manga[]; link: string }) => {
  const exceedsCells = manga.length > 8;
  const excessCount = manga.length - 8;
  const selection = new Array(8).fill(undefined).map((_, i) => manga[i]);
  return (
    <div className="flex-1 ">
      <div className="grid grid-cols-4 justify-end gap-2">
        {selection.map((m, i) => {
          if (m) {
            return <MangaTile manga={m} key={m.id} />;
          }
          return (
            <div className="aspect-w-2 aspect-h-3 " key={i}>
              <div className="rounded-lg bg-slate-100"></div>
            </div>
          );
        })}
      </div>
      {exceedsCells && (
        <div className="flex justify-end">
          <Link href={link}>
            <p className="p-2  text-xs font-semibold text-slate-500 hover:underline">
              +{excessCount} More
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

const MangaTile = ({ manga: { title, id, thumbnail } }: { manga: Manga }) => {
  return (
    <a
      className="aspect-w-2 aspect-h-3  rounded-md object-fill transition-all hover:translate-x-[2px] hover:-translate-y-[2px] hover:ring-[2.5px] hover:ring-slate-400"
      href={`https://anilist.co/manga/${id}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <Image src={thumbnail} alt={title} fill className="rounded-md" />
    </a>
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
  const relativeDate = dayjs(dateCreated).fromNow();
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
                  <span>• last updated {dayjs(lastUpdated).fromNow()}</span>
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
              className="hover:underline hover:underline-offset-1"
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
        {tags[0] && <TagsComponent tags={tags} link={link} />}
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
