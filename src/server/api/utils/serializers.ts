import { type Manga } from "@prisma/client";
import type { PopulatedCollection, SerializedAuthor } from "../types";

export type SerializedCollection = {
  id: number;
  author: SerializedAuthor;
  isBookmarked: boolean;
  isFavorite: boolean;
  bookmarks: number;
  favorites: number;
  title: string;
  description: string | null;
  dateCreated: Date;
  adultContent: boolean;
  lastUpdated: Date | null;
  tags: string[];
  manga: Manga[];
};
/**
 * Serializes the returned prisma object to a more dx friendly object
 * @param collection The Populated Collection Object Fetched from prisma
 * @param author the author of the collection
 * @returns The Serialized Collection
 */
export const serializeCollection = (
  collection: PopulatedCollection,
  author: SerializedAuthor
): SerializedCollection => {
  const manga = collection.manga.map((v) => v.manga);
  const data = {
    id: collection.id,
    title: collection.title,
    dateCreated: collection.dateCreated,
    description: collection.description,
    adultContent: collection.adultContent,
    tags: <string[]>collection.tags,
    lastUpdated: collection.lastUpdated,
    author,
    manga,
    isBookmarked: collection.bookmarks
      ? collection.bookmarks.length != 0
      : false,
    isFavorite: collection.favorites ? collection.favorites.length != 0 : false,
    bookmarks: collection._count?.bookmarks ?? 0,
    favorites: collection._count?.favorites ?? 0,
  };
  return data;
};
