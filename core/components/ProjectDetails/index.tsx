import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, Link, Terminal } from "lucide-react";
import { getProjectDetails } from "@/actions/user/project";
import { formatTimeAgo } from "@/lib/time";

export default async function ProjectDetails({
  project,
}: {
  project: Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>;
}) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">{project.name}</h1>
      <div className="flex flex-col space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Information */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center text-sm text-muted-foreground">
                <Link className="mr-2 h-4 w-4" />
                <span>ID: {project.id}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>Last Updated: {formatTimeAgo(project.updatedAt)}</span>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Terminal className="mr-2 h-4 w-4" />
                <span>Build Command: {project.buildCommand}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Terminal className="mr-2 h-4 w-4" />
                <span>Install Command: {project.installCommand}</span>
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
              <Button className="mb-2 w-full">View Project</Button>
              <Button variant="outline" className="w-full">
                Edit Settings
              </Button>
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
        <Card className="shadow-lg dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-200">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Last update: {project.updatedAt.toLocaleString()}
            </p>
            {project.logs.length > 0 ? (
              <div className="mt-4 max-h-60 overflow-y-auto">
                <ul className="space-y-3">
                  {project.logs.map((log, index) => (
                    <li
                      key={index}
                      className="border-b pb-2 text-sm text-gray-300"
                    >
                      {log}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No recent logs.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}