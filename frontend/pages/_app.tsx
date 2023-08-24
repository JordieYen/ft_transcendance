import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import "../src/app/globals.css";
import CustomToaster from "@/components/CustomToaster";
import axios from "axios";
import { SocketProvider } from "@/app/socket/SocketProvider";
import { getSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { authMiddleware } from "../middleware/authMiddleware";
import { AnimatePresence } from "framer-motion";
import ShuttlecockMove from "@/components/setup/ShuttlecockMove";
import { GameProvider } from "@/app/component/game/GameContext";
import GameInvitationListener from "@/app/component/game/GameInvitationListener";
import Layout from "@/app/layout";
import Head from "next/head";

// axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_NEST_HOST}`;

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  /* NOT USING THIS FOR NOW */
  // const currentPath = router.asPath;

  const currentPath = router.asPath;
  const allowPages = ["/pong-main"];
  const showAdditionalIcon = allowPages.includes(currentPath);

  return (
    // <SessionProvider session={pageProps.session}>
      <SocketProvider>
        <SessionCheck>
          <CustomToaster />
            <Header />
            <Head>
              <title>Pongminton@TM</title>
            </Head>
            <GameProvider>
              <GameInvitationListener />
              <AnimatePresence mode="wait">
                {/* <ShuttlecockMove />
                <Component {...pageProps} /> */}
                <ShuttlecockMove key="shuttlecock-move" />
                <Component key="main-component" {...pageProps} />
              </AnimatePresence>
            </GameProvider>
        </SessionCheck>
      </SocketProvider>
    // </SessionProvider>
  );
};

const SessionCheck = ({ children }: any) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/returnRequest", {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            method: "GET",
            url: router.asPath,
            headers: {
              "Content-Type": "application/json",
            },
          }),
        });
        const data = await response.json();
        setFetchedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [router.asPath]);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (fetchedData) {
        const result = await authMiddleware(fetchedData!);
        if (result === null) {
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, [fetchedData]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !router.asPath.startsWith("/login")) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const isLoginPage = router.asPath === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default MyApp;
