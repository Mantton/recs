import type { SerializedCollection } from "@/server/api/utils/serializers";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Manga } from "@prisma/client";
import { slug } from "@/utils/slug";
import { HiOutlineBookmark, HiOutlineHeart } from "react-icons/hi";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useContext,
  createContext,
  Fragment,
  useEffect,
} from "react";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import type { AnilistIDMedia } from "@/types";
import { LoadingSpinner } from "../loading";
import { anilistStatus } from "@/server/api/functions/anilist";
import { api } from "@/utils/api";

dayjs.extend(relativeTime);

type MediaInfoContextProps = {
  getMediaInfo: (id: number) => Promise<AnilistIDMedia>;
};

export const MediaInfoContext = createContext<MediaInfoContextProps>({
  getMediaInfo: () => {
    throw "not ready";
  },
});
const useMediaInfoContext = () => useContext(MediaInfoContext);

const ActionButtons = ({
  collection,
}: {
  collection: SerializedCollection;
}) => {
  const { isBookmarked, isFavorite } = collection;
  const [bookmark, setBookmark] = useState(isBookmarked);
  const [favorite, setFavorite] = useState(isFavorite);

  const { mutate: mFav } = api.collection.toggleFavorite.useMutation();
  const { mutate: mBK } = api.collection.toggleBookmark.useMutation();
  const toggleState = (
    dispatch: Dispatch<SetStateAction<boolean>>,
    value: boolean
  ) => {
    dispatch(!value);
  };
  return (
    <>
      <div className="flex gap-2 md:gap-3 lg:gap-[1.125rem]">
        <button
          onClick={() => {
            toggleState(setBookmark, bookmark);
            mBK({ id: collection.id });
          }}
        >
          <HiOutlineBookmark
            className={clsx({
              ["h-[1.25rem] w-[1.25rem] text-slate-400 transition-colors duration-300"]:
                true,
              ["hover:text-slate-600"]: !bookmark,
              ["fill-current hover:fill-none"]: bookmark,
            })}
          />
        </button>
        <button
          onClick={() => {
            toggleState(setFavorite, favorite);
            mFav({ id: collection.id });
          }}
        >
          <HiOutlineHeart
            className={clsx({
              ["h-[1.25rem] w-[1.25rem] transition-colors duration-300 hover:text-red-400"]:
                true,
              ["text-slate-400"]: !favorite,
              ["fill-current text-red-400 hover:fill-none"]: favorite,
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
          <Link href={`/recs?t=${tag}`} key={tag}>
            <p className={tagClassName}>{tag}</p>
          </Link>
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

const MangaTile = ({ manga: { title, id, thumbnail } }: { manga: Manga }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <Link
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        className="rounded-md object-fill transition-transform hover:translate-x-[1px] hover:-translate-y-[1px] hover:ring-[1.5px] hover:ring-slate-400"
        href={`/recs?m=${id}`}
      >
        <Image src={thumbnail} alt={title} fill className="rounded-md" />
      </Link>
      <Transition
        as={Fragment}
        show={showInfo}
        enter="transition-opacity duration-[25ms]"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-[25ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-none absolute left-full  top-[12.5%] z-10 mx-2 h-fit min-h-[50%] min-w-[200%] max-w-lg select-none rounded-lg bg-slate-300 p-2 opacity-95 shadow-lg">
          <p className="text-lg font-semibold leading-tight tracking-tight">
            {title}
          </p>
          <MangaInfoPanel id={id} />
        </div>
      </Transition>
    </>
  );
};

const MangaInfoPanel = ({ id }: { id: number }) => {
  const { getMediaInfo } = useMediaInfoContext();
  const [data, setData] = useState<AnilistIDMedia | null>(null);

  useEffect(() => {
    if (data) {
      return;
    }

    const run = async () => {
      try {
        const d = await getMediaInfo(id);
        setData(d);
      } catch {
        //TODO: handle error state
      }
    };
    void run();
  }, [id, data, getMediaInfo]);

  if (!data)
    return (
      <div className="flex items-center justify-center text-gray-700">
        <LoadingSpinner size={20} />
      </div>
    );
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-sm">
          <span>{anilistStatus(data.status)}</span>
          <span>{data.favourites.toLocaleString()} Favorites</span>
          <span>{data.popularity.toLocaleString()} Following</span>
        </div>
        <span className="text-xl font-bold tracking-wide text-slate-900">
          {data.averageScore}%
        </span>
      </div>
    </>
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
