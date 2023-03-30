import { z } from "zod";

export const GetCollectionsSchema = z.object({
  asc: z.boolean().optional().default(false),
  sort: z.string().optional().default("bookmarks"),
  authorId: z.string().min(1).optional(),
  mangaId: z.number().int().nonnegative().optional(),
  tagId: z.string().min(1).optional(),
  cursor: z.number().positive().nullish(),
});

export const CreateCollectionSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(50)
    // .regex(/^[a-zA-Z0-9]*$/) // TODO: Do we want titles to only be alphanumeric?
    .trim(),

  description: z.string().min(1).max(240).trim().optional(),

  includedManga: z.number().int().positive().array().min(1).max(50),
});

export const ToggleStateSchema = z.object({
  id: z.number().nonnegative(),
});
