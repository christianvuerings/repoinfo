import queryToRepoOwner from "./queryToRepoOwner";

describe("queryToRepoOwner", () => {
  test("GitHub https URL", () => {
    expect(
      queryToRepoOwner("https://github.com/pinterest/gestalt/pulls")
    ).toEqual({
      repo: "gestalt",
      owner: "pinterest"
    });
  });

  test("GitHub http URL", () => {
    expect(
      queryToRepoOwner("http://github.com/pinterest/gestalt/pulls")
    ).toEqual({
      repo: "gestalt",
      owner: "pinterest"
    });
  });

  test("without URL", () => {
    expect(queryToRepoOwner("pinterest/gestalt")).toEqual({
      repo: "gestalt",
      owner: "pinterest"
    });
  });
});
