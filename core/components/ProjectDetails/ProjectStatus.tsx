"use client";

import { CheckCircle, XCircle, Loader } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProjectDetails } from "@/actions/db/user";
import { useCallback, useEffect, useState } from "react";
import { getProjectStatus } from "@/actions/db/project";

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

        if (status !== "pending" && intervalId) {
          clearInterval(intervalId);
        }
      }, 5000);
    };

    handleFetchStatus().then((initialStatus) => {
      if (initialStatus === "pending") {
        startPolling();
      }
    });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [handleFetchStatus, id]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {status === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : status === "failed" ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Loader className="h-5 w-5 animate-spin text-yellow-500" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Build{" "}
            {status === "success"
              ? "Succeeded"
              : status === "failed"
                ? "Failed"
                : "Pending"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
