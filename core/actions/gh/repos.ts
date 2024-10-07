/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";
import { getAccessToken } from "@/db/user";
import { formatTimeAgo } from "@/lib/time";
import { Repo } from "@/types/gh";

export async function getRepos(github_id: number) {
  if (!github_id || github_id == -1) return [];
  const access_token = await getAccessToken(github_id);
  if (!access_token) return [];

  try {
    const res = await axios.get(
      `https://api.github.com/user/repos?visibility=all&sort=updated`,
      {
        headers: {
          Authorization: `token ${access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    return (res.data as Repo[])
      .map((i: any) => ({
        name: i.name,
        last_updated: formatTimeAgo(new Date(i.updated_at)),
        private: i.private,
        owner: i.owner.login.toLowerCase(),
      }))
      .slice(0, 10);
  } catch (error) {
    console.log(error);
    return [];
  }
}
