"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Grid, List, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/components/Dashboard/Project";
import { getProjects } from "@/actions/db/user";
import { SORT_ORDER, VIEW_MODE } from "@/types/project";
import { localValues } from "../../lib/localValues";

export default function DashboardClient({
  initialProjects,
}: {
  initialProjects: Awaited<ReturnType<typeof getProjects>>;
}) {
  const [projects] = useState(initialProjects);
  const [viewMode, setViewMode] = useState<VIEW_MODE>(localValues.viewMode);
  const [searchTerm, setSearchTerm] = useState(localValues.searchTerm);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(localValues.sortOrder);

  const filteredAndSortedProjects = useMemo(() => {
    const result = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.repoName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === SORT_ORDER.most_recent
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [projects, searchTerm, sortOrder]);

  const handleSort = (order: SORT_ORDER) => {
    setSortOrder(order);
  };

  return (
    <div className="mt-14 flex h-full w-full flex-col overflow-hidden p-4 sm:p-6 md:p-8">
      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Repositories and Projects..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              localStorage.setItem("searchTerm", e.target.value);
            }}
            aria-label="Search projects"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by{" "}
                {sortOrder === SORT_ORDER.most_recent ? "most" : "least"} recent{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  handleSort(SORT_ORDER.most_recent);
                  localStorage.setItem("sortOrder", SORT_ORDER.most_recent);
                }}
              >
                Most recent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleSort(SORT_ORDER.least_recent);
                  localStorage.setItem("sortOrder", SORT_ORDER.least_recent);
                }}
              >
                Least recent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setViewMode(VIEW_MODE.grid);
              localStorage.setItem("viewMode", VIEW_MODE.grid);
            }}
            className={
              viewMode === VIEW_MODE.grid
                ? "text-primary"
                : "text-muted-foreground"
            }
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setViewMode(VIEW_MODE.list);
              localStorage.setItem("viewMode", VIEW_MODE.list);
            }}
            className={
              viewMode === VIEW_MODE.list
                ? "text-primary"
                : "text-muted-foreground"
            }
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                Add New <Plus className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={"/new"}>
                <DropdownMenuItem className="cursor-pointer">
                  New Project
                </DropdownMenuItem>
              </Link>
              <Link href={"https://gh.new"} target="_blank">
                <DropdownMenuItem className="cursor-pointer">
                  New Repository
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-grow">
        <h2 className="mb-6 text-3xl font-bold">Your Projects</h2>
        {filteredAndSortedProjects.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No projects found. Try adjusting your search.
          </p>
        ) : (
          <div
            className={`grid gap-6 ${viewMode === VIEW_MODE.grid ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredAndSortedProjects.map((project) => (
              <Project key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
