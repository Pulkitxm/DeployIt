"use client";

import { Button } from "@/components/ui/button";
import { importProject } from "@/actions/gh/import";
import { ImportProjectType } from "@/types/project";
import { useRouter } from "next/navigation";

export default function ImportButton({
  importProjectData,
}: {
  importProjectData: ImportProjectType;
}) {
  const router = useRouter();
  async function handleImportProject() {
    const { id } = await importProject(importProjectData);
    if (id) router.push(`/project/${id}`);
  }
  return (
    <Button className="w-full" onClick={handleImportProject}>
      Deploy
    </Button>
  );
}

