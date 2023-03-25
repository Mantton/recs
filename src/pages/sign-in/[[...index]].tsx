import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

const SignInPage = () => (
  <>
    <Head>
      <title>Recs | Sign Up</title>
      <meta
        name="description"
        content="Manga/Manhwa recommendations made easy!"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex h-full items-center justify-center pb-20">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorPrimary: "#64748b",
          },
        }}
      />
    </div>
  </>
);

export default SignInPage;
