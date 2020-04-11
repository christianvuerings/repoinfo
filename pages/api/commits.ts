import { graphql } from "@octokit/graphql";
import { NextApiRequest, NextApiResponse } from "next";

const owner = "pinterest";
const repo = "gestalt";
const accessToken = "52040c832414c5f784d2cc6a8269305210e6c6c2";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${accessToken}`
  }
});

// Inspiration from https://stackoverflow.com/a/47523826/117193
const commitsQuery = ({ cursor }: { cursor: string }): string => `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    master: ref(qualifiedName: "master") {
      target {
        ... on Commit {
          history(first: 100, after: ${cursor ? `"${cursor}"` : null}) {
            ...CommitFragment
          }
        }
      }
    }
  }
}
fragment CommitFragment on CommitHistoryConnection {
  totalCount
  nodes {
    oid
    message
    committedDate
    author {
      name
      email
    }
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
`;

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // api.github.com/repos/:owner/:repo/commits

  let hasNextPage = true;
  let cursor = null;
  let count = 0;
  let commits: Array<{
    author: {
      email: string;
      name: string;
    };
    committedDate: string;
    message: string;
    oid: string;
  }> = [];

  while (hasNextPage) {
    const commitQuery = commitsQuery({ cursor });
    console.log(`request : ${count}`);
    // eslint-disable-next-line no-await-in-loop
    const commitResult = await graphqlWithAuth(commitQuery, {
      owner,
      name: "gestalt"
    });

    const { history } = commitResult && commitResult.repository.master.target;
    commits = [...commits, ...history.nodes];
    cursor = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : "";
    hasNextPage = !!history.pageInfo.hasNextPage;
    count += 1;
  }

  res.status(200).json({ commits });
};
