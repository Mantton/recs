import { type AnilistMedia } from "@/types";
import { searchAnilist } from "@/utils/anilist";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "./loading";
import Image from "next/image";
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

const MediaList = ({ media }: { media: AnilistMedia[] }) => {
  return (
    <>
      <div className=" grid h-64 grid-flow-col grid-rows-1 gap-2 overflow-x-scroll px-4">
        {media.map((v) => (
          <MediaTile {...v} key={v.id} />
        ))}
      </div>
    </>
  );
};
const MediaTile = (media: AnilistMedia) => {
  const title = media.title.english ?? media.title.userPreferred;
  return (
    <>
      <div className="my-4 flex flex-col gap-2">
        <div className="aspect-w-2 aspect-h-3 relative w-28 rounded-md bg-indigo-400  ">
          <Image
            src={media.coverImage.large}
            className="h-full w-full rounded-md object-cover"
            alt={title}
            fill
          />
        </div>
        <p className="text-sm leading-tight tracking-tight text-gray-700 line-clamp-2">
          {title}
        </p>
      </div>
    </>
  );
};
export default function AnilistMangaSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnilistMedia[]>([]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      const run = async () => {
        if (!query) return;
        setLoading(true);
        setResults([]);
        console.log("Searching...", query);
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
        {results[0] && <MediaList media={results} />}
      </div>
    </>
  );
}
