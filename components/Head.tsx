import React from "react";
import Head from "next/head";

export default function Header({ title }: { title?: string }): JSX.Element {
  return (
    <>
      <Head>
        <title>{title || "RepoInfo"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>
        {`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          body {
            background: #242932;
            color: #fff;
          }

          * {
            box-sizing: border-box;
          }

          *:focus {
            box-shadow: 0 0 0 4px rgba(255, 51, 102, 0.8);
            outline: none;
          }
        `}
      </style>
    </>
  );
}
