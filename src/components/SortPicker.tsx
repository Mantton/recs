import type { State } from "@/types";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsChevronExpand, BsCheckLg } from "react-icons/bs";
const OPTIONS = [
  { id: "favorites", label: "Favorites" },
  { id: "bookmarks", label: "Bookmarks" },
  { id: "creationDate", label: "Created At" },
  { id: "mangaCount", label: "Manga Count" },
];

type Props = {
  ss: State<string>;
};
export default function CollectionSorter({ ss }: Props) {
  const getLabel = (id: string) => OPTIONS.find((v) => v.id == id)?.label ?? "";

  return (
    <Listbox value={ss.value} onChange={(v) => ss.dispatch(v)}>
      <div className="relative w-40">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-500">
          <span className="block truncate">{getLabel(ss.value)}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronExpand
              className="h-4 w-4 text-gray-600"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {OPTIONS.map(({ id, label }) => (
              <Listbox.Option
                key={id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-slate-100 text-slate-900" : "text-gray-900"
                  }`
                }
                value={id}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                        <BsCheckLg className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
