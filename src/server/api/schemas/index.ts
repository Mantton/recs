import { z } from "zod";

export enum GetCollectionSort {
  favorites = "favorites",
  bookmarks = "bookmarks",
  mangaCount = "mangaCount",
  creationDate = "creationDate",
}
export const GetAllSchema = z.object({
  page: z.number().int().nonnegative().optional().default(1),
  asc: z.boolean().optional().default(false),
  sort: z
    .nativeEnum(GetCollectionSort)
    .optional()
    .default(GetCollectionSort.bookmarks),
});
