import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Header from '@/app/component/common/Header';
import Footer from '@/app/component/common/Footer';
import '../src/app/globals.css';
import { SocketProvider } from '@/app/socket/SocketProvider';
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from 'next/router';


const MyApp = ({ Component, pageProps, router }: AppProps) => {

  const currentPath = router.asPath;
  const allowPages = [ '/pong-main'];
  const showAdditionalIcon = allowPages.includes(currentPath);

  return (
    <SessionProvider session={pageProps.session}>
      <SocketProvider>
        <div>
            <Header showAdditionalIcon={showAdditionalIcon}/>
            {/* <ContentWrapper> */}
                <Component {...pageProps} />
            {/* </ContentWrapper> */}
            <Footer />
      </div>
      </SocketProvider>
    </SessionProvider>
  );
};

const ContentWrapper = ({ children }: any) => {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [showLoginPage, setShowLoginPage] = useState(false);


  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage(router.pathname)) {
      router.replace('/login');
    } else if (status === 'unauthenticated' && isLoginPage(router.pathname)) {
      setShowLoginPage(true);

    }
  }, [status]);

  if (status === "authenticated") {
    console.log('session', session);
    return <>{children}</>;
  }

  if (showLoginPage) {
    return <>{children}</>;
  }

  // Loading
  return null;

}


const isLoginPage = (pathname: string) => {
  return pathname === '/login';
}

export default MyApp;
