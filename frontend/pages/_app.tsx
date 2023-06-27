import React from "react";
import type { AppProps } from "next/app";
import Header from "@/app/component/common/Header";
import Footer from "@/app/component/common/Footer";
import "../src/app/globals.css";
import { SocketProvider } from "@/app/socket/SocketProvider";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const currentPath = router.asPath;

  const allowPages = ["/pong-main", "/main-menu"];
  const showAdditionalIcon = allowPages.includes(currentPath);
  const userData = pageProps.login;

  return (
    <SocketProvider>
      <div className="wrapper">
        <Header showAdditionalIcon={showAdditionalIcon} />
        <Component {...pageProps} />
        <Footer />
      </div>
    </SocketProvider>
  );
};

export default MyApp;
