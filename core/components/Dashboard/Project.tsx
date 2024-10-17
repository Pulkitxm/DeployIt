import { GitBranch, Settings, Eye, Copy, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/actions/db/user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimeAgo } from "@/lib/time";
import { NEXT_PUBLIC_WEB_SERVER } from "@/lib/envVars";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import ProjectStatus from "@/components/ProjectDetails/ProjectStatus";

export function Project({
  project,
  isExpanded,
}: {
  project: Awaited<ReturnType<typeof getProjects>>[0];
  isExpanded?: boolean;
}) {
  const { toast } = useToast();

  const projectUrl = `https://${project.slug}.${NEXT_PUBLIC_WEB_SERVER}`;
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Project URL copied to clipboard",
    });
  };

  return (
    <Card
      className={`flex w-full ${
        isExpanded ? "" : "max-w-md"
      } flex-col space-y-3 shadow-md`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-xl font-semibold">
            {project.name}
          </CardTitle>
          <ProjectStatus id={project.id} />
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(projectUrl, "_blank")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview Project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input value={projectUrl} readOnly className="flex-grow" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(projectUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy URL</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4" />
            <span>
              {project.repoOwner}/{project.repoName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Updated {formatTimeAgo(project.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-1">
        <Button asChild variant="default" className="w-full flex-grow">
          <Link href={`/project/${project.id}`}>View Project</Link>
        </Button>
        <Button asChild variant="default">
          <Link href={`/project/${project.id}/settings`}>
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
