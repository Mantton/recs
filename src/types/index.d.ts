// * Anilist

export type AnilistMedia = {
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

export type AnilistQueryResponse = {
  data: {
    Page: {
      media: AnilistMedia[];
    };
  };
};
