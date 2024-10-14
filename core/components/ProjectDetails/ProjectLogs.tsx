"use client";

import { getProjectDetails, getProjectLogs } from "@/actions/db/user";
import { LogsType } from "@/types/project";
import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export default function ProjectLogs({
  project,
}: {
  project: Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>;
}) {
  const [loading, setLoading] = useState(false);
  const [projectLogs, setProjectLogs] = useState<LogsType>([]);
  const { toast } = useToast();

  const handleFetch = useCallback(async () => {
    setLoading(true);
    try {
      const logs = await getProjectLogs(project.id);
      if (logs) {
        setProjectLogs(logs);
      } else {
        throw new Error("Failed to fetch logs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  }, [project.id, toast]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const LogContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      );
    }

    if (projectLogs.length === 0) {
      return <p className="text-sm text-gray-400">No recent logs.</p>;
    }

    return (
      <ul className="space-y-3">
        {projectLogs.map((log, index) => (
          <li
            key={index}
            className="flex items-start border-b border-gray-700 py-2 text-sm text-gray-300"
          >
            <p className="mr-2 shrink-0 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300">
              {log.timestamp.toUTCString()}
            </p>
            <p className="break-words">{log.value}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="shadow-lg dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFetch}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Load Logs
        </Button>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          Last update: {project.updatedAt.toUTCString()}
        </p>
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <LogContent />
        </div>
      </CardContent>
    </Card>
  );
}
