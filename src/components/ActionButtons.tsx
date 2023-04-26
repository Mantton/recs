import { type SerializedCollection } from "@/server/api/utils/serializers";
import { api } from "@/utils/api";
import clsx from "clsx";
import { useState, type Dispatch, type SetStateAction } from "react";
import { HiOutlineBookmark, HiOutlineHeart } from "react-icons/hi";

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

export default ActionButtons;
