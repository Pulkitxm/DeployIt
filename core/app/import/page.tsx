"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { getRepoDetails } from "@/actions/gh/repo";
import { useSession } from "next-auth/react";
import ImportProject from "@/components/ImportProject";
import { ImportProjectType } from "@/types/project";

export default function Import() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo_url") || "";
  const repoOwner = searchParams.get("repo_owner") || "";
  const repoName = searchParams.get("repo_name") || "";

  const [importProjectData, setImportProjectData] = useState<ImportProjectType>(
    {
      projectName: repoName,
      repoName,
      repoOwner,
      repoUrl,
      rootDir: "/",
      build: {
        open: false,
        buildCommand: "",
        installCommand: "",
      },
      env: {
        open: false,
        values: [{ key: "", value: "" }],
      },
    },
  );

  const fetchRepoDetails = useCallback(async () => {
    const githubId = session?.user.github_id;
    if (!githubId) return;
    const repoDteials = await getRepoDetails({ githubId, repoOwner, repoName });
    console.log(repoDteials);
  }, [repoName, repoOwner, session?.user.github_id]);

  useEffect(() => {
    if (!repoUrl || !repoOwner || !repoName) return;
    fetchRepoDetails();
  }, [fetchRepoDetails, repoName, repoOwner, repoUrl]);

  if (!repoUrl || !repoOwner || !repoName) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <Alert variant="destructive" className="max-w-[300px]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please make sure you are using the correct URL.
            <Link href="/dashboard" className="hover:underline">
              Go back
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ImportProject
      importProjectData={importProjectData}
      setImportProjectData={setImportProjectData}
    />
  );
}
