import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, Link as LinkIcon } from "lucide-react";
import { getProjectDetails } from "@/actions/db/user";
import { formatTimeAgo } from "@/lib/time";
import Link from "next/link";
import ProjectLogs from "./ProjectLogs";

const NEXT_PUBLIC_WEB_SERVER = process.env.NEXT_PUBLIC_WEB_SERVER;

export default function ProjectDetails({
  project,
}: {
  project: Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>;
}) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold underline">{project.name}</h1>
      <div className="flex flex-col space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Information */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center text-sm text-muted-foreground">
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>ID: {project.id}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>Last Updated: {formatTimeAgo(project.updatedAt)}</span>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span>Slug: {project.slug}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`${project.slug}.${NEXT_PUBLIC_WEB_SERVER}`}
                target="_blank"
              >
                <Button className="mb-2 w-full">View Project</Button>
              </Link>
              <Link href={`/project/${project.id}/settings`}>
                <Button variant="outline" className="w-full">
                  Edit Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Repository Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">
              Repository: {project.repoOwner}/{project.repoName}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <GitBranch className="mr-2 h-4 w-4" />
              <span>Branch: {project.branch}</span>
            </div>
          </CardContent>
        </Card>

        <ProjectLogs project={project} />
      </div>
    </>
  );
}
