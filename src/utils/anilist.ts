import type {
  AnilistMediaQueryResponse,
  AnilistSearchQueryResponse,
} from "@/types";

export const searchAnilist = async (search: string) => {
  const query = `query FullSearch($page: Int = 1, $search: String) {
  Page(page: $page, perPage: 30) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(
      type: MANGA
      search: $search
      sort: [SEARCH_MATCH, POPULARITY_DESC, SCORE_DESC]
    ) {
      ...searchResult
    }
  }
}
fragment searchResult on Media {
  id
  title {
    english
    userPreferred
  }
  coverImage {
    large
  }
  status(version: 2)
  genres
  isAdult
}
`;
  const body = JSON.stringify({
    query,
    variables: {
      search,
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

  const data = <AnilistSearchQueryResponse>await response.json();
  return data.data.Page.media;
};

export const getAnilistMediaInfo = async (id: number) => {
  const query = `
  query media($id: Int = 122161) {
  Media(id: $id, type: MANGA) {
    id
    title {
      userPreferred
      english
    }
    coverImage {
      
      large
    }
    status(version: 2)
    isAdult
    meanScore
    averageScore
    popularity
    favourites
  }
}
  `;

  const body = JSON.stringify({
    query,
    variables: {
      id,
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

  const data = <AnilistMediaQueryResponse>await response.json();
  return data.data.Media;
};
