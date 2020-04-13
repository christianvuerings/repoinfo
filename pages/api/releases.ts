import { graphql } from "@octokit/graphql";
import { NextApiRequest, NextApiResponse } from "next";

const accessToken = process.env.GITHUB_PERSONAL_TOKEN;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${accessToken}`
  }
});

const releasesQuery = ({ cursor }: { cursor: string }): string => `
query ($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    releases(last: 100, after: ${cursor ? `"${cursor}"` : null}) { 
			nodes { 
				name 
				createdAt 
				url 
      }
      pageInfo {
        hasNextPage
        endCursor
      }
		}
  }
}
`;

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({
      error: "Please provide 'owner' and 'repo' parameters"
    });
  }

  let hasNextPage = true;
  let cursor = null;
  let count = 0;
  let releases: Array<{
    name: string;
    createdAt: string;
    url: string;
  }> = [];

  try {
    while (hasNextPage) {
      const releaseQuery = releasesQuery({ cursor });
      console.log(`API: Releases ${owner}/${repo} : ${count}`);
      // eslint-disable-next-line no-await-in-loop
      const releasesResult = await graphqlWithAuth(releaseQuery, {
        owner,
        name: repo
      });

      console.log(JSON.stringify(releasesResult, null, 4));

      const { releases: releasesInfo } =
        releasesResult && releasesResult.repository;
      releases = [...releases, ...releasesInfo.nodes];
      cursor = releasesInfo.pageInfo.hasNextPage
        ? releasesInfo.pageInfo.endCursor
        : "";
      hasNextPage = !!releasesInfo.pageInfo.hasNextPage;
      count += 1;
    }

    return res.status(200).json({ releases });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
