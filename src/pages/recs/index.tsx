import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/loading";
import type { SerializedCollection } from "@/server/api/utils/serializers";
import CollectionView from "@/components/collection/CollectionView";

const BuildGrid = (data: SerializedCollection[]) => {
  return (
    <div
      id="collections"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {data.map((c) => (
        <CollectionView {...c} key={c.id} />
      ))}
    </div>
  );
};
const Home: NextPage = () => {
  const { data, isLoading } = api.collection.getCollections.useQuery({});
  return (
    <>
      <Head>
        <title>Recs</title>
        <meta
          name="description"
          content="Manga/Manhwa recommendations made easy!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {data && BuildGrid(data)}
      </div>
    </>
  );
};

export default Home;
