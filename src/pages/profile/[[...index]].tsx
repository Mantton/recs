import { UserProfile } from "@clerk/nextjs";
import Head from "next/head";

const UserProfilePage = () => (
  <>
    <Head>
      <title>Recs | My Profile</title>
      <meta
        name="description"
        content="Manga/Manhwa recommendations made easy!"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex h-full items-center justify-center pb-20">
      <UserProfile
        path="/profile"
        routing="path"
        appearance={{
          variables: {
            colorPrimary: "#64748b",
          },
        }}
      />
    </div>
    ;
  </>
);

export default UserProfilePage;
