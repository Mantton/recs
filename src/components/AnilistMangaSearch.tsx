import { type AnilistMedia } from "@/types";
import { searchAnilist } from "@/utils/anilist";
import { useState, useEffect, useContext, createContext } from "react";
import { LoadingSpinner } from "./loading";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Image from "next/image";

/**
 * Selection Context
 * There might be an easier way of doing this lol
 */
type SelectionContextProp = {
  insertMedia: (m: AnilistMedia) => void;
  removeMedia: (m: AnilistMedia) => void;
  selections: AnilistMedia[];
};
export const SelectionContext = createContext<SelectionContextProp>({
  insertMedia: () => {
    //
  },
  removeMedia: () => {
    //
  },
  selections: [],
});
export const useSelectionContext = () => useContext(SelectionContext);

/**
 * Search Icon Component
 */
const SearchIcon = () => {
  return (
    <div className="grid h-full w-12 place-items-center text-gray-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

/**
 * Media List component
 */
const MediaList = ({
  media,
  addition,
}: {
  media: AnilistMedia[];
  addition: boolean;
}) => {
  return (
    <>
      <div className="flex h-64 grid-flow-col-dense grid-rows-1	 gap-2 overflow-x-auto px-4">
        {media.map((v) => (
          <MediaTile media={v} addition={addition} key={v.id} />
        ))}
      </div>
    </>
  );
};

/**
 * media tile component
 */
const MediaTile = ({
  media,
  addition,
}: {
  media: AnilistMedia;
  addition: boolean;
}) => {
  const title = media.title.english ?? media.title.userPreferred;
  const { insertMedia, removeMedia } = useSelectionContext();
  const buttonClassName =
    "h-1/4 w-full text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100";
  return (
    <>
      <div className="my-4 w-28 flex-shrink-0">
        <div className="group aspect-w-2 aspect-h-3 rounded-md ">
          <Image
            src={media.coverImage.large}
            className="h-full w-full rounded-md object-cover"
            alt={title}
            fill
          />

          <button
            type="button"
            className="rounded-md bg-opacity-0 transition-all duration-500 group-hover:bg-slate-700 group-hover:bg-opacity-30"
            onClick={() => (addition ? insertMedia(media) : removeMedia(media))}
          >
            {addition && <AiOutlinePlusCircle className={buttonClassName} />}
            {!addition && <AiOutlineCloseCircle className={buttonClassName} />}
          </button>
        </div>
        <p className="text-sm leading-tight tracking-tight text-gray-700 line-clamp-2">
          {title}
        </p>
      </div>
    </>
  );
};

/**
 * core search component
 */
export default function AnilistMangaSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnilistMedia[]>([]);
  const { selections } = useSelectionContext();
  useEffect(() => {
    const debounce = setTimeout(() => {
      const run = async () => {
        if (!query) {
          setResults([]);
        }
        setLoading(true);
        setResults([]);
        try {
          const data = await searchAnilist(query);
          setResults(data);
        } catch {}
        setLoading(false);
      };
      void run();
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    setResults([]);
  }, [selections]);

  return (
    <>
      <div className="flex w-3/4 flex-col gap-4 rounded-md bg-gray-50 py-2">
        <p className="px-2 text-lg font-medium">Add Manga</p>
        <div className="mx-auto w-[90%]">
          <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-white focus-within:shadow-lg">
            {!loading && <SearchIcon />}
            {loading && (
              <div className="p-2">
                <LoadingSpinner />
              </div>
            )}
            <input
              className="peer h-full w-full pr-2 text-sm text-gray-700 outline-none"
              id="search"
              placeholder="Search Anilist"
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value.trim())}
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
            />
          </div>
        </div>

        <div>
          {results[0] && <MediaList media={results} addition={true} />}
          <div hidden={!!results[0]}>
            {selections[0] && <MediaList media={selections} addition={false} />}
          </div>
        </div>
      </div>
    </>
  );
}
