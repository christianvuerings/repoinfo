const regex = /(^http(?:s)?:\/\/github.com\/)*(?<owner>[^/]+)\/(?<repo>[^/]+)/i;

export default function(
  query = ""
): {
  owner: string;
  repo: string;
} | null {
  const match = query.match(regex);
  if (match && match.groups && match.groups.owner && match.groups.repo) {
    const { owner, repo } = match.groups;
    return { owner, repo };
  }
  return null;
}
