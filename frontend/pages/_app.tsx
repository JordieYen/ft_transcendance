import React from 'react';
import type { AppProps } from 'next/app';
import Header from '@/app/component/common/Header';
import Footer from '@/app/component/common/Footer';
import '../src/app/globals.css';
import UserData from '@/app/webhook/user_data';


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
