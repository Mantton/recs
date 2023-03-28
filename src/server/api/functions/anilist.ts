import type { AnilistSearchMedia, AnilistSearchQueryResponse } from "@/types";
import { MediaQuery } from "../utils/queries";

export const getAnilistMedia = async (mediaIds: number[]) => {
  const ids = Array.from(new Set(mediaIds));
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

  const data = <AnilistSearchQueryResponse>await response.json(); // This is equivalent to (await response.json()) as AnilistQueryResponse
  return data.data.Page.media;
};

export const getAnilistMediaTags = (media: AnilistSearchMedia) => {
  return media.genres.concat(media.tags.map((v) => v.name));
};

export const anilistStatus = (str: string) => {
  switch (str.toLowerCase()) {
    case "releasing":
      return "Ongoing";
    case "finished":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "HIATUS":
      return "Hiatus";
    case "NOT_YET_RELEASED":
      return "Planned";
  }
};
