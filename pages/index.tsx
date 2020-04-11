import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "../components/Head";
import Logo from "../components/Logo";
import Header from "../components/Links";

const Home = (): JSX.Element => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query) {
      router.push({
        pathname: "/info",
        query: { query }
      });
    }
  };

  return (
    <>
      <Head title="Search for a GitHub repo" />
      <Header />

      <main>
        <h1 className="logoContainer">
          <Logo size={100} />
        </h1>
        <form className="form" method="" action="" onSubmit={handleSubmit}>
          <input
            className="query"
            type="text"
            placeholder="Type a owner/repo or enter a URL"
            value={query}
            onChange={(e): void => setQuery(e.target.value)}
          />
          <div className="buttons">
            <button className="button" type="submit">
              Show Info
            </button>
          </div>
        </form>
      </main>

      <style jsx>
        {`
          .logoContainer {
            margin: 20vh 50px 20px;
          }
          main {
            align-items: center;
            display: flex;
            flex-direction: column;
          }
          .form {
            align-items: center;
            display: flex;
            max-width: 500px;
            flex-direction: column;
            width: 100%;
          }
          .query {
            border-radius: 24px;
            border: none;
            font-size: 24px;
            padding: 16px 24px;
            width: 100%;
          }
          .query: hover {
            box-shadow: 0 0 0 4px rgba(255, 51, 102, 0.8);
          }
          .query:focus {
            outline: 0;
            box-shadow: 0 0 0 4px rgba(255, 51, 102, 0.8);
          }
          .buttons {
            margin-top: 20px;
          }
          .button {
            border-radius: 8px;
            color: #111;
            letter-spacing: -0.8px;
            font-weight: bold;
            font-size: 24px;
            padding: 12px 16px;
          }
          .button:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

export default Home;
