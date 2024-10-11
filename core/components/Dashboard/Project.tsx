import { GitBranch, GitFork, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/actions/user/project";
import { formatTimeAgo } from "@/lib/time";
import { UpdateIcon } from "@radix-ui/react-icons";

export function Project({
  project,
}: {
  project: Awaited<ReturnType<typeof getProjects>>[0];
}) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <GitFork className="mr-2 h-4 w-4" />
          <Link
            href={`https://github.com/${project.repoOwner}/${project.repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            {project.repoOwner}/{project.repoName}
            <ExternalLink className="ml-1 inline-block h-3 w-3" />
          </Link>
        </div>
        <div className="flex items-start text-sm text-muted-foreground">
          <div className="flex items-start text-sm text-muted-foreground">
            <GitBranch className="mr-2 h-4 w-4" />
            <Link
              href={`https://github.com/${project.repoOwner}/${project.repoName}/tree/${project.branch}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              {project.branch}
              <ExternalLink className="ml-1 inline-block h-3 w-3" />
            </Link>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="flex items-start text-sm text-muted-foreground">
            <UpdateIcon className="mr-2 h-4 w-4" />
            <p className="transition-colors">
              {formatTimeAgo(project.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/project/${project.name}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
