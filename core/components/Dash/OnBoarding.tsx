"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { Repo } from "@/types/gh";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Onboarding({
  repos,
  loading,
}: {
  repos: Repo[];
  loading: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold">
          Let&apos;s build something new.
        </h1>
        <p className="mb-8 text-gray-400">
          To deploy a new Project, select the repository you want to deploy. The
          repository must be hosted on GitHub.
        </p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <Card className="w-full border-gray-800 bg-gray-900 lg:w-1/2">
            <CardHeader>
              <CardTitle>Import Git Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800">
                    <SelectValue placeholder="pulkitxm2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pulkitxm2">pulkitxm2</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 size-2 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    className="w-full border-gray-700 bg-gray-800 pl-10"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="h-[200px] max-h-[300px] overflow-y-auto p-2 px-5">
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
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-gray-800 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 uppercase text-gray-300">
                            {repo.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <Link
                                href={`https://github.com/${repo.owner}/${repo.name}`.toLowerCase()}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                              >
                                {repo.name}
                              </Link>
                              {repo.private && (
                                <LockIcon className="ml-1 h-4 w-4" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {repo.last_updated}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-gray-600 bg-transparent hover:bg-gray-800"
                        >
                          Import
                        </Button>
                      </div>
                    ))}
              </div>
              <Button variant="link" className="mt-4 text-blue-400">
                Import Third-Party Git Repository →
              </Button>
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
