import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

const SignUpPage = () => (
  <>
    <Head>
      <title>Recs - Sign In</title>
      <meta
        name="description"
        content="Manga/Manhwa recommendations made easy!"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex h-full items-center justify-center pb-20">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#64748b",
          },
        }}
      />
    </div>
  </>
);

export default SignUpPage;
