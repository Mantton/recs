export const MediaQuery = `
query MediaQuery ($ids: [Int]) {
  Page {
    media(id_in: $ids, type: MANGA) {
      id
      title {
        english
        userPreferred
      }
      coverImage {
        large
      }
      genres
      tags {
        name
        category
      }
      isAdult
    }
  }
}
`;
