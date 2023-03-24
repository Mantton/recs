import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const collectionsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  /**
   * Get All Collections
   */
  getAll: publicProcedure.query(({ ctx }) => {
    //
  }),

  /**
   * Get All Collections From Account
   */
  getForAccount: publicProcedure.query(async () => {
    //
  }),

  /**
   * Get Single Collection Information
   */
  getCollection: publicProcedure.query(async () => {
    //
  }),

  /**
   * Creates a new Collection
   */
  createCollection: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * Edits A Collections Basic Information like title or bio
   */
  editCollection: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * Add A Manga To A Collection
   */
  addMangaToCollection: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * Removes a Manga From A Provided Collection
   */
  removeMangaFromCollection: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * Adds A Manga To the Current User's Favorites
   */
  favoriteCollection: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * Removes A Manga From the current users favorites
   */
  removeCollectionFromFavorite: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * Adds a manga to a users bookmarks
   */
  bookmarkCollection: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),

  /**
   * remove manga from user's bookmarks
   */
  removeCollectionFromBookmarks: privateProcedure.mutation(async ({ ctx }) => {
    //
  }),
});
