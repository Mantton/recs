import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Layout from "@/components/layout/layout";

const Application: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ClerkProvider {...pageProps}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ClerkProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(Application);
