import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  Clock,
  Link as LinkIcon,
  EyeIcon,
  ExternalLink,
  GitFork,
} from "lucide-react";
import { getProjectDetails } from "@/actions/db/user";
import { formatTimeAgo } from "@/lib/time";
import Link from "next/link";
import ProjectLogs from "./ProjectLogs";
import { NEXT_PUBLIC_WEB_SERVER } from "@/lib/envVars";
import ProjectStatus from "./ProjectStatus";

export default function ProjectDetails({
  project,
}: {
  project: Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>;
}) {
  return (
    <>
      <div className="mb-6 flex items-center space-x-2">
        <h1 className="text-3xl font-bold underline">{project.name}</h1>
        <ProjectStatus id={project.id} />
      </div>
      <div className="flex flex-col space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Information */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>ID: {project.id}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>Last Updated: {formatTimeAgo(project.updatedAt)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <EyeIcon className="mr-2 h-4 w-4" />
                <span>Views: {project.views}</span>
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
                href={`https://${project.slug}.${NEXT_PUBLIC_WEB_SERVER}`}
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
          <CardContent className="flex flex-col space-y-2">
            <div className="group flex items-center text-sm text-muted-foreground">
              <GitFork className="mr-2 h-4 w-4" />
              <Link
                href={`https://github.com/${project.repoOwner}/${project.repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors group-hover:text-primary group-hover:underline"
              >
                {project.repoOwner}/{project.repoName}
                <ExternalLink className="ml-1 inline-block h-3 w-3" />
              </Link>
            </div>
            <div className="group flex items-start text-sm text-muted-foreground">
              <div className="flex items-start text-sm text-muted-foreground">
                <GitBranch className="mr-2 h-4 w-4" />
                <Link
                  href={`https://github.com/${project.repoOwner}/${project.repoName}/tree/${project.branch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors group-hover:text-primary group-hover:underline"
                >
                  {project.branch}
                  <ExternalLink className="ml-1 inline-block h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProjectLogs project={project} />
      </div>
    </>
  );
}
