import React from "react";
import Footer from "./footer";
import NavBar from "./navbar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <NavBar />
      <main className="min-h-screen p-2 sm:p-6">{children}</main>
      <Footer />
    </>
  );
}
