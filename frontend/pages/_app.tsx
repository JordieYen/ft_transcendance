import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Header from '@/app/component/common/Header';
import Footer from '@/app/component/common/Footer';
import '../src/app/globals.css';
import { SocketProvider } from '@/app/socket/SocketProvider';
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { middleware } from '@/app/middleware';

const MyApp = ({ Component, pageProps, router }: AppProps) => {

  const currentPath = router.asPath;
  const allowPages = [ '/pong-main'];
  const showAdditionalIcon = allowPages.includes(currentPath);
  return (
    <SessionProvider session={pageProps.session}>
      <SocketProvider>
        <div>
            <Header showAdditionalIcon={showAdditionalIcon}/>
            <ContentWrapper>
                <Component {...pageProps} />
            </ContentWrapper>
            <Footer />
      </div>
      </SocketProvider>
    </SessionProvider>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req } = context;
  console.log('req', req);
  return {
    props: {
      req,
    },
  };
};
  

const ContentWrapper = ({ children }: any) => {
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/returnRequest',{
          credentials: 'include',
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
  }, []);

  useEffect(() => {
    if (fetchedData) {
      console.log('fetchedData', fetchedData);
      
      const result = middleware(fetchedData!);
      console.log('result', result);
    }
  }, [fetchedData]);
  
  return <>{children}</>;
}


const isLoginPage = (pathname: string) => {
  return pathname === '/login';
}

export default MyApp;
