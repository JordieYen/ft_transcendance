import React from 'react';
import type { AppProps } from 'next/app';
import Header from '@/app/common/header';
import Footer from '@/app/common/footer';
import '../src/app/globals.css';
import UserData from '@/app/data/user_data';


const MyApp = ({ Component, pageProps, router }: AppProps) => {

  const currentPath = router.asPath;

  const allowPages = [ '/pong-main'];
  const showAdditionalIcon = allowPages.includes(currentPath);
  return (
    <div>
        <Header showAdditionalIcon={showAdditionalIcon}/>
          <Component {...pageProps} />
          <Footer />
        <Footer />
    </div>
  );
};

export default MyApp;
