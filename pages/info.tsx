import React, { useState } from "react";
import { useDebounce } from "react-use";
import { useRouter } from "next/router";
import CommitsPerMonth from "../components/CommitsPerMonth";
import Head from "../components/Head";
import Link from "next/link";
import Links from "../components/Links";
import Logo from "../components/Logo";
import queryToRepoOwner from "../utils/queryToRepoOwner";
import ReleasesPerMonth from "../components/ReleasesPerMonth";

const Info = (): JSX.Element => {
  const router = useRouter();

  const [query, setQuery] = useState(String(router.query.query || ""));
  const [repo, setRepo] = useState("");
  const [owner, setOwner] = useState("");

  useDebounce(
    () => {
      if (query) {
        const params = new URLSearchParams({ query });
        router.push(`/info?${params}`);
      }
      const response = queryToRepoOwner(query);
      setRepo((response && response.repo) || "");
      setOwner((response && response.owner) || "");
    },
    1000,
    [query]
  );

  const handleInputUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query) {
      const params = new URLSearchParams({ query });
      router.push(`/info?${params}`);
    }
  };

  return (
    <div className="container">
      <Head title="Search for a GitHub repo" />

      <header>
        <Link href="/">
          <a className="logoLink">
            <h1 className="logoContainer">
              <Logo />
            </h1>
          </a>
        </Link>
        <form className="form" method="" action="" onSubmit={handleSubmit}>
          <input
            className="query"
            type="text"
            placeholder="Type a repo or enter a URL"
            value={query}
            onChange={handleInputUpdate}
          />
        </form>
      </header>
      <main>
        <div>
          {repo && owner ? (
            <div className="info">
              <h2># Commits per Month</h2>
              <CommitsPerMonth repo={repo} owner={owner} />

              <h2># Releases per Month</h2>
              <ReleasesPerMonth repo={repo} owner={owner} />
            </div>
          ) : null}
        </div>
      </main>

      <Links />

      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          header {
            align-items: center;
            column-gap: 32px;
            row-gap: 16px;
            display: grid;
            margin: 32px;
          }
          @media (min-width: 800px) {
            grid-template-columns: min-content auto;
          }
          .logoContainer {
            margin: 0;
          }
          .logoLink {
            border-radius: 8px;
            display: block;
            padding: 4px 8px;
            text-decoration: none;
          }
          .logoLink:hover {
            color: rgba(255, 255, 255, 1);
            text-decoration: underline;
          }
          main {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .form {
            align-items: center;
            display: flex;
            width: 100%;
          }
          .query {
            border-radius: 24px;
            border: none;
            font-size: 24px;
            max-width: 800px;
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
          .info {
            background: rgba(0, 0, 0, 0.2);
          }
          .info h2 {
            font-size: 40px;
            padding: 50px 10px 10px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

Info.getInitialProps = async (): Promise<{}> => ({});

export default Info;
