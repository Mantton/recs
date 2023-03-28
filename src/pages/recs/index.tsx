import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/loading";
import type { SerializedCollection } from "@/server/api/utils/serializers";
import CollectionView, {
  MediaInfoContext,
} from "@/components/collection/CollectionView";
import type { AnilistIDMedia } from "@/types";
import { getAnilistMediaInfo } from "@/utils/anilist";

const BuildGrid = ({ data }: { data: SerializedCollection[] }) => {
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
  const cache: Record<number, AnilistIDMedia> = {};

  const getMediaInfo = async (id: number) => {
    let d = cache[id];
    if (d) return d;
    d = await getAnilistMediaInfo(id);
    cache[id] = d;
    return d;
  };

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
        {data && (
          <MediaInfoContext.Provider value={{ getMediaInfo }}>
            <BuildGrid data={data} />
          </MediaInfoContext.Provider>
        )}
      </div>
    </>
  );
};

export default Home;
