import React from "react";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import Footer from "@/app/common/footer";
import "../src/app/globals.css";
import UserData from "@/app/data/user_data";
import CustomToaster from "@/components/CustomToaster";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  /* NOT USING THIS FOR NOW */
  // const currentPath = router.asPath;

  // const allowPages = ["/pong-main"];
  // const showAdditionalIcon = allowPages.includes(currentPath);
  return (
    <>
      <CustomToaster />
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Footer />
    </>
  );
};

export default MyApp;
