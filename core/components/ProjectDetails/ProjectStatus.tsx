"use client";

import { CheckCircle, XCircle, Loader, TimerIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProjectDetails } from "@/actions/db/user";
import { useCallback, useState, useEffect } from "react";
import { getProjectStatus } from "@/actions/db/project";
import { PROJECT_STATUS } from "@/types/project";

export default function ProjectStatus({
  id,
}: {
  id: Exclude<Awaited<ReturnType<typeof getProjectDetails>>, null>["id"];
}) {
  const [status, setStatus] = useState<string | null>(null);

  const handleFetchStatus = useCallback(async () => {
    const status = await getProjectStatus(id);
    setStatus(status);
    return status;
  }, [id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      intervalId = setInterval(async () => {
        const status = await getProjectStatus(id);
        setStatus(status);

        if (
          status !== PROJECT_STATUS.DELETE_IN_QUEUE &&
          status !== PROJECT_STATUS.BUILD_IN_QUEUE &&
          status !== PROJECT_STATUS.DELETE_PENDING &&
          status !== PROJECT_STATUS.BUILD_PENDING &&
          intervalId
        ) {
          clearInterval(intervalId);
        }
      }, 5000);
    };

    handleFetchStatus().then((initialStatus) => {
      if (
        initialStatus === PROJECT_STATUS.BUILD_IN_QUEUE ||
        initialStatus === PROJECT_STATUS.DELETE_IN_QUEUE ||
        initialStatus === PROJECT_STATUS.BUILD_PENDING ||
        initialStatus === PROJECT_STATUS.DELETE_PENDING
      ) {
        startPolling();
      }
    });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [handleFetchStatus, id]);

  const displayVal = (() => {
    switch (status) {
      case PROJECT_STATUS.BUILD_SUCCESS:
        return "Build Succeeded";
      case PROJECT_STATUS.BUILD_FAILED:
        return "Build Failed";
      case PROJECT_STATUS.BUILD_PENDING:
        return "Building...";
      case PROJECT_STATUS.BUILD_IN_QUEUE:
        return "Building...";
      case PROJECT_STATUS.DELETE_PENDING:
        return "Deleting...";
      case PROJECT_STATUS.DELETE_FAILED:
        return "Delete Failed";
      case PROJECT_STATUS.DELETE_SUCCESS:
        return "Delete Succeeded";
      case PROJECT_STATUS.DELETE_IN_QUEUE:
        return "Deleting...";
      default:
        return "Pending";
    }
  })();
  const displayIcon = (() => {
    switch (status) {
      case PROJECT_STATUS.BUILD_SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case PROJECT_STATUS.BUILD_FAILED:
        return <XCircle className="h-5 w-5 text-orange-500" />;
      case PROJECT_STATUS.BUILD_PENDING:
        return <Loader className="h-5 w-5 animate-spin text-yellow-500" />;
      case PROJECT_STATUS.BUILD_IN_QUEUE:
        return <TimerIcon className="h-5 w-5 animate-pulse text-blue-500" />;
      case PROJECT_STATUS.DELETE_PENDING:
        return <Loader className="h-5 w-5 animate-spin text-red-500" />;
      case PROJECT_STATUS.DELETE_FAILED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case PROJECT_STATUS.DELETE_SUCCESS:
        return <CheckCircle className="h-5 w-5 text-red-500" />;
      case PROJECT_STATUS.DELETE_IN_QUEUE:
        return <TimerIcon className="h-5 w-5 animate-pulse text-red-500" />;
      default:
        return <Loader className="h-5 w-5 animate-spin text-yellow-500" />;
    }
  })();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {displayIcon}
        </TooltipTrigger>
        <TooltipContent>
          <p>{displayVal}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
