import { Repo } from "@/types/gh";
import { LockIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export default function DisplayRepo({ repo }: { repo: Repo }) {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-between border-b border-gray-800 py-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
            theme === "light"
              ? "bg-gray-200 text-black"
              : "bg-gray-700 text-gray-300"
          } uppercase`}
        >
          {repo.name[0]}
        </div>
        <div className="w-40">
          <div className="flex items-start space-x-1">
            <Link
              href={`https://github.com/${repo.owner}/${repo.name}`.toLowerCase()}
              target="_blank"
              rel="noreferrer"
              className="max-w-32 overflow-hidden hover:underline"
            >
              {repo.name}
            </Link>
            {repo.private && <LockIcon className="ml-1 h-4 w-4" />}
          </div>
          <p className="text-sm text-gray-400">{repo.last_updated}</p>
        </div>
      </div>
      <Link
        href={{
          pathname: `/import`,
          query: {
            repo_url: `https://github.com/${repo.owner}/${repo.name}`,
            repo_owner: repo.owner,
            repo_name: repo.name,
          },
        }}
      >
        <Button
          variant="outline"
          className={`border-gray-600 bg-transparent ${
            theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-800"
          }`}
        >
          Import
        </Button>
      </Link>
    </div>
  );
}
