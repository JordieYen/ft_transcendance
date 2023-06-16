import React from "react";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import "../src/app/globals.css";
import CustomToaster from "@/components/CustomToaster";
import UserData from "@/app/webhook/user_data";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";

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
    </>
  );
};

export default MyApp;
