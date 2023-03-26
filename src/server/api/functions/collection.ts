import { type Prisma, type PrismaClient } from "@prisma/client";
import type { z } from "zod";
import { type CreateCollectionSchema, GetCollectionSort } from "../schemas";
import type { GetCollectionsSchema } from "../schemas";
import { getUser, getUsers } from "./clerk";
import { serializeCollection } from "../utils/serializers";
import { TRPCError } from "@trpc/server";
import { getAnilistMedia, getAnilistMediaTags } from "./anilist";
import { type AnilistMedia } from "@/types";
type GetCollectionsParams = z.infer<typeof GetCollectionsSchema> & {
  userId?: string;
};

type CreateCollectionsParams = z.infer<typeof CreateCollectionSchema> & {
  userId: string;
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

/**
 * Method Creates a new collection for a provided user.
 * @param CreateCollectionParams
 */
export const createCollection = async (
  {
    title,
    description,
    includedManga,
    userId: authorId,
  }: CreateCollectionsParams,
  prisma: PrismaClient
) => {
  // Get User Information
  const user = await getUser(authorId);

  // Could also check for verification but the current clerk setup requires users to be verified by default
  if (!user)
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "FORBIDDEN",
    });
  // * Add Manga To DB
  const manga = await getAnilistMedia(includedManga);
  const adultContent = manga.some((v) => v.isAdult);
  await prisma.$transaction(addManga(manga, prisma));

  // Create Collection & Other Related Records
  const ids = manga.map((v) => v.id);
  const tags = Array.from(new Set(manga.flatMap(getAnilistMediaTags)));

  const collection = await prisma.$transaction(async (tx) => {
    // Create Collection record
    const { id: collectionId } = await tx.collection.create({
      data: {
        title,
        description,
        authorId,
        adultContent,
        tags,
      },
      select: {
        id: true,
      },
    });

    // Collection - Manga Join Table Record
    await tx.collectionManga.createMany({
      data: ids.map((mangaId) => ({ collectionId, mangaId })),
      skipDuplicates: true, // For Safety but should never actually be needed
    });

    // Create Favorite Record
    await tx.favorite.create({
      data: {
        collectionId,
        accountId: authorId,
      },
    });

    // Fetch & return return newly populated record]
    const collection = await tx.collection.findUnique({
      where: {
        id: collectionId,
      },
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
        // Include Favorites & bookmarks for serialization method
        favorites: {
          where: {
            accountId: authorId,
          },
        },
        bookmarks: {
          where: {
            accountId: authorId,
          },
        },
      },
    });

    if (!collection)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });

    return collection;
  });

  return serializeCollection(collection, user);
};

/**
 * Saves anilist media to db.
 * @param manga The List of anilist media to save to db
 * @param prisma PrismaClient
 */
const addManga = (media: AnilistMedia[], prisma: PrismaClient) => {
  return media.map((manga) => {
    return prisma.manga.upsert({
      where: { id: manga.id },
      create: {
        id: manga.id,
        title: manga.title.english ?? manga.title.userPreferred,
        isAdult: manga.isAdult,
        thumbnail: manga.coverImage.large,
      },
      update: {}, // No Updates
      select: {
        id: true, // Not required but prisma limitation
      },
    });
  });
};
