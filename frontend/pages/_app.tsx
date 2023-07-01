import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import "../src/app/globals.css";
import CustomToaster from "@/components/CustomToaster";
import axios from "axios";
import { SocketProvider } from "@/app/socket/SocketProvider";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { authMiddleware } from "../middleware/authMiddleware";

axios.defaults.baseURL = "http://localhost:3000/";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  /* NOT USING THIS FOR NOW */
  // const currentPath = router.asPath;

  const currentPath = router.asPath;
  const allowPages = ["/pong-main"];
  const showAdditionalIcon = allowPages.includes(currentPath);
  return (
    <SessionProvider session={pageProps.session}>
      <SocketProvider>
        {/* <div className="wrapper"> */}
          <ContentWrapper>
            {/* <Header showAdditionalIcon={showAdditionalIcon}/> */}
            <CustomToaster />
            <Header />
            <Component {...pageProps} />
            {/* <Footer /> */}
          </ContentWrapper>
        {/* </div> */}
      </SocketProvider>
    </SessionProvider>
  );
};

const ContentWrapper = ({ children }: any) => {
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
