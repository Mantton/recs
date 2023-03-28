import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
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
      <div className="flex flex-col items-center justify-center ">
        <p>Valor Valeris!</p>
      </div>
    </>
  );
};

export default Home;
