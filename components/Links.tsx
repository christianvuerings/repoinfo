import Link from "next/link";
import React from "react";

const Links = (): JSX.Element => (
  <div className="links">
    <Link href="/about">
      <a>About</a>
    </Link>
    <Link href="/">
      <a>Source code</a>
    </Link>

    <style jsx>
      {`
        .links {
          display: flex;
          padding: 8px 12px;
        }
        a {
          color: rgba(255, 255, 255, 0.75);
          border-radius: 8px;
          display: block;
          font-size: 16px;
          padding: 8px 12px;
          text-decoration: none;
        }
        a:hover {
          color: rgba(255, 255, 255, 1);
          text-decoration: underline;
        }
      `}
    </style>
  </div>
);

export default Links;
