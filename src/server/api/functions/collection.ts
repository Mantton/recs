import { type Prisma, type PrismaClient } from "@prisma/client";
import type { z } from "zod";
import { GetCollectionSort } from "../schemas";
import type { GetCollectionsSchema } from "../schemas";
import { getUser, getUsers } from "./clerk";
import { serializeCollection } from "../utils/serializers";
import { TRPCError } from "@trpc/server";
type GetCollectionsParams = z.infer<typeof GetCollectionsSchema> & {
  userId?: string;
};

/**
 * Method gets collections from prisma
 * @returns Collection Array
 */
export const getCollections = async (
  query: GetCollectionsParams,
  prisma: PrismaClient
) => {
  /**
   * Account Collections Guard
   * If Querying for Collections from Account, Ensure the Account Exists
   */
  if (query.authorId) {
    const user = await getUser(query.authorId);

    if (!user)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ACCOUNT_NOT_FOUND",
      });
  }

  //
  const accountId = query.userId;
  const TAKE = 30;
  const SKIP = Math.max(query.page - 1 * TAKE, 0);
  const SORT = query.asc ? "asc" : "desc";

  // Set Order Property
  let order: Prisma.CollectionOrderByWithRelationInput = {
    bookmarks: {
      _count: SORT,
    },
  };

  switch (query.sort) {
    case GetCollectionSort.bookmarks:
      break;
    case GetCollectionSort.favorites:
      order = {
        favorites: {
          _count: SORT,
        },
      };
      break;
    case GetCollectionSort.creationDate:
      order = {
        dateCreated: SORT,
      };
      break;

    case GetCollectionSort.mangaCount:
      order = {
        manga: {
          _count: SORT,
        },
      };
      break;
  }

  const whereClause = query.authorId || query.mangaId || query.tagId;
  // Query prisma for collections
  const collections = await prisma.collection.findMany({
    skip: SKIP,
    take: TAKE,
    orderBy: [order, { dateCreated: "asc" }],

    /**
     * Query for collections by author, by manga or by tag
     */
    ...(whereClause && {
      where: {
        // Author
        ...(query.authorId && {
          authorId: query.authorId,
        }),
        // Manga
        ...(query.mangaId && {
          manga: {
            some: {
              mangaId: query.mangaId,
            },
          },
        }),
        // Tags
        ...(query.tagId && {
          tags: {
            array_contains: query.tagId,
          },
        }),
      },
    }),
    // Include the Favorite & Bookmarks Count
    include: {
      _count: {
        select: {
          favorites: true,
          bookmarks: true,
        },
      },
      // Include thee Manga's Title, Thumbnail, ID & Adult Flag
      manga: {
        include: {
          manga: {
            select: {
              title: true,
              thumbnail: true,
              id: true,
              isAdult: true,
            },
          },
        },
      },
      /**
       * if an authenticated user is requesting,
       * fetch the favorites & bookmarks where the ID matches the Authenticated User ID
       * This will be used to check whether the user has liked or bookmarked this collection
       */
      ...(accountId && {
        favorites: {
          where: {
            accountId,
          },
        },
        bookmarks: {
          where: {
            accountId,
          },
        },
      }),
    },
  });

  // Get authors from clerk
  const authors = await getUsers(collections.map((v) => v.authorId));
  const getAuthor = (id: string) => {
    const author = authors.find((v) => v.id === id);
    if (!author)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AUTHOR_NOT_FOUND",
      });
    return author;
  };

  // Return serialized collection object
  return collections.map((c) => serializeCollection(c, getAuthor(c.authorId)));
};
