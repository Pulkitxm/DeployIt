/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Octokit } from "@octokit/rest";
import { getAccessToken } from "@/db/user";
import { formatTimeAgo } from "@/lib/time";
import { Repo } from "@/types/gh";

export async function getRepos(
  github_id: number,
  query?: string,
): Promise<Repo[]> {
  if (!github_id || github_id == -1) return [];
  const access_token = await getAccessToken(github_id);
  if (!access_token) return [];

  const octokit = new Octokit({ auth: access_token });

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      sort: "updated",
      per_page: 100,
    });

    const repos = data.map((repo: any) => ({
      name: repo.name,
      last_updated: formatTimeAgo(new Date(repo.updated_at)),
      private: repo.private,
      owner: repo.owner.login.toLowerCase(),
    }));

    if (query) {
      return repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query.toLowerCase()) ||
          repo.owner.includes(query.toLowerCase()),
      );
    }
    return repos;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}
