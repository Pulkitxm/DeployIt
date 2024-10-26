"use client";

import { Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ImportProjectType } from "@/types/project";
import ChooseDir from "./ChooseDir";
import BuilAndOutput from "./BuilAndOutput";
import EnvironmentVariable from "./EnvironmentVariable";
import ChooseBranch from "./ChooseBranch";
import ImportButton from "@/components/ImportProject/ImportButton";

export default function ImportProject({
  importProjectData,
  setImportProjectData,
}: {
  importProjectData: ImportProjectType;
  setImportProjectData: React.Dispatch<React.SetStateAction<ImportProjectType>>;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-background py-10 text-foreground">
      <main className="mx-auto max-w-6xl p-8 xl:w-[900px]">
        <h1 className="mb-2 text-4xl font-bold">You&apos;re almost done.</h1>
        <p className="mb-8 text-muted-foreground">
          Please follow the steps to configure your Project and deploy it.
        </p>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <div className="mb-4 mt-10 space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-primary">Configure Project</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-muted"></div>
                <span className="text-muted-foreground">Deploy</span>
              </div>
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              GIT REPOSITORY
            </div>
            <Link
              href={`https://github.com/${importProjectData.repoOwner}/${importProjectData.repoName}`.toLowerCase()}
              target="_blank"
              className="group mb-1 flex items-center"
            >
              <Github className="mr-2 h-4 w-4" />
              <span className="group-hover:underline">
                {importProjectData.repoOwner}/{importProjectData.repoName}
              </span>
            </Link>
            <div className="mb-4 text-sm text-muted-foreground">
              {importProjectData.branch}
            </div>
          </div>
          <div className="w-full lg:w-2/3">
            <div className="rounded-lg bg-card p-6 text-card-foreground">
              <h2 className="mb-4 text-xl font-semibold">Configure Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Project Name
                  </label>
                  <Input
                    value={importProjectData.projectName}
                    onChange={(e) =>
                      setImportProjectData((prev) => ({
                        ...prev,
                        projectName: e.target.value,
                      }))
                    }
                  />
                </div>
                <ChooseBranch
                  importProjectData={importProjectData}
                  setImportProjectData={setImportProjectData}
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">
                    Root Directory
                  </label>
                  <div className="flex">
                    <Input
                      value={importProjectData.rootDir}
                      readOnly
                      className="flex-grow"
                    />
                    <ChooseDir
                      importProjectData={importProjectData}
                      setImportProjectData={setImportProjectData}
                    />
                  </div>
                </div>
                <BuilAndOutput
                  importProjectData={importProjectData}
                  setImportProjectData={setImportProjectData}
                />
                <EnvironmentVariable
                  importProjectData={importProjectData}
                  setImportProjectData={setImportProjectData}
                />

                <ImportButton importProjectData={importProjectData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
