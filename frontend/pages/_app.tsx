import React from "react";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import "../src/app/globals.css";
import CustomToaster from "@/components/CustomToaster";
import axios from "axios";
import { SocketProvider } from "@/app/socket/SocketProvider";

axios.defaults.baseURL = "http://localhost:3000/";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  /* NOT USING THIS FOR NOW */
  // const currentPath = router.asPath;

  // const allowPages = ["/pong-main"];
  // const showAdditionalIcon = allowPages.includes(currentPath);
  return (
    <SocketProvider>
      <div>
        <CustomToaster />
        <Header />
        <Component {...pageProps} />
      </div>
    </SocketProvider>
  );
};

export default MyApp;
