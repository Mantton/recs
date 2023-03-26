import { omit } from "lodash";
import type { PopulatedCollection, SerializedAuthor } from "../types";

/**
 * Serializes the returned prisma object to a more dx friendly object
 * @param collection The Populated Collection Object Fetched from prisma
 * @param author the author of the collection
 * @returns The Serialized Collection
 */
export const serializeCollection = (
  collection: PopulatedCollection,
  author: SerializedAuthor
) => {
  const manga = collection.manga.map((v) => v.manga);
  return {
    ...omit(collection, [
      "author",
      "manga",
      "authorId",
      "_count",
      "bookmarks",
      "favorites",
    ]),
    author,
    manga,
    isBookmarked: collection.bookmarks
      ? collection.bookmarks.length != 0
      : false,
    isFavorite: collection.favorites ? collection.favorites.length != 0 : false,
    bookmarks: collection._count?.bookmarks ?? 0,
    favorites: collection._count?.favorites ?? 0,
  };
};
