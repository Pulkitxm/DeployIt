import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: "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",
});
// octokit.rest.repos
//   .listForOrg({
//     org: "pulkitxm",
//     type: "private",
//   })
//   .then(({ data }) => {
//     console.log(data);
//   });

(async () => {
  try {
    const { data } = await octokit.request('POST /orgs/pulkitxm/repos', {
        org: 'ORG',
        name: 'Hello-World',
        description: 'This is your first repository',
        homepage: 'https://github.com',
        'private': false,
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
