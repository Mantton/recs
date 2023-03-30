import { type AnilistSearchMedia } from "@/types";
import { searchAnilist } from "@/utils/anilist";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  Fragment,
} from "react";
import { LoadingSpinner } from "./loading";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Image from "next/image";
import { Combobox, Transition } from "@headlessui/react";

/**
 * Selection Context
 * There might be an easier way of doing this lol
 */
type SelectionContextProp = {
  insertMedia: (m: AnilistSearchMedia) => void;
  removeMedia: (m: AnilistSearchMedia) => void;
  selections: AnilistSearchMedia[];
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
  media: AnilistSearchMedia[];
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
  media: AnilistSearchMedia;
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
  const [results, setResults] = useState<AnilistSearchMedia[]>([]);
  const { selections, insertMedia } = useSelectionContext();
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
        <div className="relative mx-auto w-[90%]">
          <Combobox
            onChange={(v) => {
              insertMedia(v as AnilistSearchMedia);
            }}
          >
            <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-white focus-within:shadow-lg">
              <div className="">
                {!loading && <SearchIcon />}
                {loading && (
                  <div className="p-2">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
              <Combobox.Input
                className="h-full w-full border-none pr-2 text-sm text-gray-700"
                onChange={(event) => setQuery(event.target.value.trim())}
                id="search"
                placeholder="Search Anilist"
                // autoComplete="off"
                // onKeyPress={(e) => {
                //   e.key === "Enter" && e.preventDefault();
                // }}
              />
            </div>
            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white p-2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                {results.map((manga) => (
                  <Combobox.Option key={manga.id} value={manga}>
                    <div className="flex cursor-pointer gap-4 rounded-md p-4 transition-colors duration-200 hover:bg-slate-100">
                      <Image
                        src={manga.coverImage.large}
                        alt={manga.title.userPreferred}
                        width={55}
                        height={82.5}
                        className="rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium">
                          {manga.title.userPreferred}
                        </p>
                        {manga.title.english &&
                          manga.title.english != manga.title.userPreferred && (
                            <p className="text-sm italic text-slate-700">
                              {manga.title.english}
                            </p>
                          )}
                        <div className="flex flex-wrap items-center gap-2">
                          {manga.isAdult && (
                            <div className="w-fit rounded-md bg-red-100 px-1 py-1 text-slate-500">
                              <p className="text-xs leading-tight tracking-tighter text-opacity-95">
                                NSFW
                              </p>
                            </div>
                          )}
                          {manga.genres[0] && (
                            <div className="flex gap-2 ">
                              {manga.genres.map((v) => (
                                <span
                                  className="w-fit rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500"
                                  key={v}
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </Combobox>
        </div>

        {selections[0] && <MediaList media={selections} addition={false} />}
      </div>
    </>
  );
}
