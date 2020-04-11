const regex = new RegExp(
  /(^http(?:s)?:\/\/github.com\/)*(?<owner>[^/]+)\/(?<repo>[^/]+)/i
);

export default function(
  query = ""
): {
  owner: string;
  repo: string;
} | null {
  const match = query.match(
    /(^http(?:s)?:\/\/github.com\/)*(?<owner>[^/]+)\/(?<repo>[^/]+)/i
  );
  console.log(query, match);
  if (match && match.groups && match.groups.owner && match.groups.repo) {
    const { owner, repo } = match.groups;
    return { owner, repo };
  }
  return null;
}
