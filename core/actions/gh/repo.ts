/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAccessToken } from "@/db/user";
import { FileItemType } from "@/types/project";
import { Octokit } from "@octokit/rest";

export async function getRepoBranches({
  repoName,
  repoOwner,
  githubId,
}: {
  repoName: string;
  repoOwner: string;
  githubId: number;
}) {
  if (githubId == -1) return [];
  const access_token = await getAccessToken(githubId);
  if (!access_token) return null;

  try {
    const branches = await detectBranch(access_token, repoOwner, repoName);

    return branches;
  } catch (error) {
    console.error("Error fetching repo details:", error);
    return null;
  }
}

async function detectBranch(
  access_token: string,
  repoOwner: string,
  repoName: string,
) {
  const octokit = new Octokit({ auth: access_token });
  try {
    const { data } = await octokit.repos.listBranches({
      owner: repoOwner,
      repo: repoName,
    });

    const branches = data.map((branch) => branch.name);
    return branches;
  } catch (error) {
    console.error("Error fetching repo details:", error);
    return [];
  }
}

export const fetchRepoDirs = async ({
  github_id,
  path,
  repoName,
  repoOwner,
  branchName,
}: {
  github_id: number;
  path: string;
  repoName: string;
  repoOwner: string;
  branchName: string;
}): Promise<FileItemType[]> => {
  try {
    const access_token = await getAccessToken(github_id);
    if (!access_token) return [];
    const octokit = new Octokit({ auth: access_token });

    const response = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path,
      ref: branchName,
    });
    if (Array.isArray(response.data)) {
      return response.data
        .filter((item) => item.type === "dir" && item.name[0] != ".")
        .map((item) => ({
          name: item.name,
          path: item.path,
          type: item.type as "dir" | "file",
          children: item.type === "dir" ? [] : undefined,
        }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching repo content:", error);
    throw error;
  }
};
