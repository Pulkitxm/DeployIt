"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Repo } from "@/types/gh";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { ReloadIcon } from "@radix-ui/react-icons";
import SearchBar from "./SearchBar";
import { Dispatch, SetStateAction } from "react";
import DisplayRepo from "./DisplayRepo";
import { useSession } from "next-auth/react";

export default function Onboarding({
  repos,
  loading,
  fetchRepos,
  query,
  setQuery,
}: {
  repos: Repo[];
  loading: boolean;
  fetchRepos: (query: string) => Promise<void>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  const { theme } = useTheme();
  const { data: session } = useSession();
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-${
        theme === "light" ? "white" : "black"
      } p-8 text-${theme === "light" ? "black" : "white"}`}
    >
      <div className="mx-auto max-w-6xl">
        <h1
          className={`mb-2 text-4xl font-bold text-${
            theme === "light" ? "black" : "white"
          }`}
        >
          Let&apos;s build something new.
        </h1>
        <p className="mb-8 text-gray-400">
          To deploy a new Project, select the repository you want to deploy. The
          repository must be hosted on GitHub.
        </p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <Card className="w-full lg:w-1/2">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <p>Import Git Repository</p>
                <span title="reload">
                  <ReloadIcon
                    className="cursor-pointer"
                    onClick={() => fetchRepos(query)}
                  />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={session?.user.username} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={session?.user.username ?? ""}>
                      {session?.user.username}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <SearchBar
                  fetchRepos={fetchRepos}
                  query={query}
                  setQuery={setQuery}
                />
              </div>
              <div className="h-[300px] max-h-[300px] overflow-y-auto p-2 px-5">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-gray-700 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex flex-col">
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="mt-1 h-3 w-20 rounded" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded" />
                      </div>
                    ))
                  : repos.map((repo, index) => (
                      <DisplayRepo repo={repo} key={index} />
                    ))}
              </div>
            </CardContent>
          </Card>
          <div className="relative w-full lg:w-1/2">
            <Image
              className="w-full"
              alt="Onboarding"
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
}
