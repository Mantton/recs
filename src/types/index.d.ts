// * Anilist
import type { Dispatch, SetStateAction } from "react";
export type AnilistSearchMedia = {
  id: number;
  title: {
    english: string;
    userPreferred: string;
  };
  coverImage: {
    large: string;
  };
  genres: string[];
  tags: {
    name: string;
  }[];
  isAdult: boolean;
};

export type AnilistSearchQueryResponse = {
  data: {
    Page: {
      media: AnilistSearchMedia[];
    };
  };
};

export type AnilistIDMedia = {
  id: number;
  title: {
    english: string;
    userPreferred: string;
  };
  coverImage: {
    large: string;
  };
  status: string;
  isAdult: boolean;
  meanScore: number;
  averageScore: number;
  popularity: number;
  favourites: number;
};

export type AnilistMediaQueryResponse = {
  data: {
    Media: AnilistIDMedia;
  };
};

export type State<T> = {
  dispatch: Dispatch<SetStateAction<T>>;
  value: T;
};
