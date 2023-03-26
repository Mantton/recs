import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { CreateCollectionSchema, GetCollectionsSchema } from "../schemas";
import { createCollection, getCollections } from "../functions";

export const collectionsRouter = createTRPCRouter({
  /**
   * Get Collections
   */
  getCollections: publicProcedure
    .input(GetCollectionsSchema)
    .query(({ ctx, input }) => {
      const userId = ctx.currentUser?.id;
      return getCollections({ ...input, userId }, ctx.prisma);
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
  createCollection: privateProcedure
    .input(CreateCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUser.id;
      return createCollection({ ...input, userId }, ctx.prisma);
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
