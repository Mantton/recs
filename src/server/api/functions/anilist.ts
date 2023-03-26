import type { AnilistMedia, AnilistQueryResponse } from "@/types";
import { MediaQuery } from "../utils/queries";

export const getAnilistMedia = async (mediaIds: number[]) => {
  const ids = new Set(mediaIds);
  const body = JSON.stringify({
    query: MediaQuery,
    variables: {
      ids,
    },
  });
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers,
    body,
  });

  const data = <AnilistQueryResponse>await response.json(); // This is equivalent to (await response.json()) as AnilistQueryResponse
  return data.data.Page.media;
};

export const getAnilistMediaTags = (media: AnilistMedia) => {
  return media.genres.concat(media.tags.map((v) => v.name));
};
