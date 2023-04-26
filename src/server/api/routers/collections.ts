import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  CreateCollectionSchema,
  GetCollectionsSchema,
  ToggleStateSchema,
  GetSingleCollectionSchema,
} from "../schemas";
import {
  createCollection,
  doesCollectionExist,
  getCollection,
  getCollections,
  toggleBookmark,
  toggleFavorite,
} from "../functions";

export const collectionsRouter = createTRPCRouter({
  /**
   * Get Collections
   */
  getCollections: publicProcedure
    .input(GetCollectionsSchema)
    .query(({ ctx, input }) => {
      const userId = ctx.currentUser;
      return getCollections({ ...input, userId }, ctx.prisma);
    }),

  /**
   * Checks whether a collection exists with the provided id
   */
  doesCollectionExist: publicProcedure
    .input(GetSingleCollectionSchema)
    .query(({ ctx, input }) => {
      if (!input.id) return false;
      return doesCollectionExist(input.id, ctx.prisma);
    }),

  /**
   * Get Single Collection Information
   */
  getCollection: publicProcedure
    .input(GetSingleCollectionSchema)
    .query(async ({ ctx, input: { id } }) => {
      if (!id) return null;
      const userId = ctx.currentUser;
      return getCollection(id, ctx.prisma, userId);
    }),

  /**
   * Creates a new Collection
   */
  createCollection: privateProcedure
    .input(CreateCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUser;
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
   * Toggles the Favorite State for a collection
   */
  toggleFavorite: privateProcedure
    .input(ToggleStateSchema)
    .mutation(({ ctx, input }) => {
      return toggleFavorite(ctx.currentUser, input.id, ctx.prisma);
    }),

  /**
   * toggles the bookmark state of a collection
   */
  toggleBookmark: privateProcedure
    .input(ToggleStateSchema)
    .mutation(async ({ ctx, input }) => {
      return toggleBookmark(ctx.currentUser, input.id, ctx.prisma);
    }),
});
