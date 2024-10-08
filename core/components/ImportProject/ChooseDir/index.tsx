"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { fetchRepoDirs } from "@/actions/gh/repo";
import { ImportProjectType, FileItemType } from "@/types/project";
import { useSession } from "next-auth/react";
import { FileTree } from "./FileTree";

export default function ChooseDir({
  importProjectData,
  setImportProjectData,
}: {
  importProjectData: ImportProjectType;
  setImportProjectData: React.Dispatch<React.SetStateAction<ImportProjectType>>;
}) {
  const { data: session } = useSession();
  const [fileStructure, setFileStructure] = useState<FileItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPath, setSelectedPath] = useState<string>(
    importProjectData.rootDir || "",
  );

  useEffect(() => {
    if (!session || !session.user.github_id) return;
    const loadInitialFileStructure = async () => {
      setLoading(true);
      try {
        const rootContent = await fetchRepoDirs({
          github_id: session.user.github_id,
          path: "",
          repoName: importProjectData.repoName,
          repoOwner: importProjectData.repoOwner,
        });
        setFileStructure(rootContent);
      } catch (error) {
        console.error("Error loading initial file structure:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialFileStructure();
  }, [importProjectData.repoName, importProjectData.repoOwner, session]);

  const handleExpand = async (path: string) => {
    try {
      const dirContent = await fetchRepoDirs({
        github_id: session?.user.github_id ?? -1,
        path,
        repoName: importProjectData.repoName,
        repoOwner: importProjectData.repoOwner,
      });
      setFileStructure((prevStructure) =>
        prevStructure.map((file) =>
          file.path === path
            ? { ...file, children: dirContent, isExpanded: true }
            : file,
        ),
      );
    } catch (error) {
      console.error("Error expanding directory:", error);
    }
  };

  const handleSelect = (path: string) => {
    setSelectedPath(path);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="ml-2">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose a directory</DialogTitle>
          <DialogDescription>
            Select a directory to set as the root for your build. Click save
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid h-96 gap-4 overflow-y-auto py-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <FileTree
              files={fileStructure}
              onExpand={handleExpand}
              onSelect={handleSelect}
              selectedPath={selectedPath}
            />
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setImportProjectData((prev) => ({
                  ...prev,
                  rootDir: selectedPath,
                }));
              }}
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
