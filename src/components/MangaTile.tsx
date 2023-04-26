import { anilistStatus } from "@/server/api/functions/anilist";
import { type AnilistIDMedia } from "@/types";
import { Transition } from "@headlessui/react";
import { type Manga } from "@prisma/client";
import Link from "next/link";
import {
  useState,
  Fragment,
  useEffect,
  createContext,
  useContext,
} from "react";
import { HiOutlineHeart, HiOutlineBookmark } from "react-icons/hi";
import { LoadingSpinner } from "./loading";
import Image from "next/image";

type MediaInfoContextProps = {
  getMediaInfo: (id: number) => Promise<AnilistIDMedia>;
};

export const MediaInfoContext = createContext<MediaInfoContextProps>({
  getMediaInfo: () => {
    throw "not ready";
  },
});
const useMediaInfoContext = () => useContext(MediaInfoContext);
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
        <div className="pointer-events-none absolute left-full top-[12.5%] z-10 mx-2 h-fit min-h-[50%] w-fit min-w-[200%] select-none rounded-lg bg-slate-300 p-2 opacity-95 shadow-lg">
          <p className="text-base font-semibold leading-tight tracking-tight">
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
      <div className="flex items-center justify-center p-4 text-gray-700">
        <LoadingSpinner size={20} />
      </div>
    );
  return (
    <>
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col text-sm">
          <span className="font-medium italic">
            {anilistStatus(data.status)}
          </span>
          <span className="flex items-center gap-1">
            {data.favourites.toLocaleString()}
            <HiOutlineHeart className="fill-current text-red-400" />
          </span>
          <span className="flex items-center gap-1">
            {data.popularity.toLocaleString()}
            <HiOutlineBookmark className="fill-current text-gray-600" />
          </span>
        </div>
        <span className="text-xl font-bold tracking-wide text-slate-900">
          {data.averageScore}%
        </span>
      </div>
    </>
  );
};

export default MangaTile;
