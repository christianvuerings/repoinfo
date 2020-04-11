import React from "react";

type Props = {
  size?: number;
};

const Logo: React.FunctionComponent<Props> = ({ size = 40 }: Props) => (
  <>
    <div className="logo">RepoInfo</div>
    <style jsx>
      {`
        .logo {
          color: #ff3366;
          letter-spacing: -0.05em;
          font-size: ${size}px;
        }
      `}
    </style>
  </>
);

export default Logo;
