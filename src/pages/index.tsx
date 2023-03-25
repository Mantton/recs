import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
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
      <main className="flex min-h-screen flex-col items-center justify-center "></main>
    </>
  );
};

export default Home;
