import {
  type Bookmark,
  type Collection,
  type CollectionManga,
  type Favorite,
  type Manga,
} from "@prisma/client";
export type SerializedAuthor = {
  id: string;
  username: string;
  profileImage: string;
};

export type PopulatedCollection = Collection & {
  manga: (CollectionManga & {
    manga: Omit<Manga, "tags">;
  })[];
  bookmarks?: Bookmark[];
  favorites?: Favorite[];
  _count?: {
    bookmarks: number;
    favorites: number;
  };
};
