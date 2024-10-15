"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import ImportProject from "@/components/ImportProject";
import { ImportProjectType } from "@/types/project";

export default function Import() {
  const searchParams = useSearchParams();
  const repoOwner = searchParams.get("repo_owner") || "";
  const repoName = searchParams.get("repo_name") || "";

  const [importProjectData, setImportProjectData] = useState<ImportProjectType>(
    {
      projectName: repoName,
      repoName,
      repoOwner,
      branch: "main",
      rootDir: "/",
      build: {
        open: false,
        buildCommand: "",
        buildDir: "dist",
      },
      env: {
        open: false,
        values: [],
      },
      repoUrl: "",
    },
  );

  if (!repoOwner || !repoName) {
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
