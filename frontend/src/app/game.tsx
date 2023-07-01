import React from "react";
import Link from "next/link";
import Head from "next/head";

const PongGame: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Pong GAME Page!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>PONGMINTON!!!</h1>
      <h2>
        <Link href="/pong-main">Back to Main Page</Link>
      </h2>
    </div>
  );
};

export default PongGame;
