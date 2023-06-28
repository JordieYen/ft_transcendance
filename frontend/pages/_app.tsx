import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Header from '@/app/component/common/Header';
import Footer from '@/app/component/common/Footer';
import '../src/app/globals.css';
import { SocketProvider } from '@/app/socket/SocketProvider';
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { authMiddleware, middleware } from '../middleware/middleware';

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const currentPath = router.asPath;

  const allowPages = ["/pong-main", "/main-menu"];
  const showAdditionalIcon = allowPages.includes(currentPath);
  return (
    <SessionProvider session={pageProps.session}>
        <SocketProvider>
          <div className='wrapper'>
              <ContentWrapper>
                <Header showAdditionalIcon={showAdditionalIcon}/>
                    <Component {...pageProps} />
                <Footer />
              </ContentWrapper>
        </div>
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
        const response = await fetch('/api/returnRequest',{
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({
            method: 'GET',
            url: router.asPath,
            headers: {
              'Content-Type': 'application/json',
            }
          }),
        });
        console.log('response', response);
        const data = await response.json();
        console.log('data', data);
        setFetchedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    if (!isLoading && !isAuthenticated && !router.asPath.startsWith('/login')) {
      router.replace('/login'); // Redirect to the login page
    }
  }, [isLoading, isAuthenticated, router]);
  
  // return isLoading ? null : <>{children}</>;
  const isLoginPage = router.asPath === '/login';

  if (isLoginPage) {
    return <>{children}</>; // Render the component on the login page
  }

  return isAuthenticated ? <>{children}</> : null;


}

export default MyApp;
