"use client";

import { Button } from "@/components/ui/button";
import { importProject } from "@/actions/gh/import";
import { ImportProjectType } from "@/types/project";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ImportButton({
  importProjectData,
}: {
  importProjectData: ImportProjectType;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function handleImportProject() {
    setLoading(true);
    const { id } = await importProject(importProjectData);
    if (id) router.push(`/project/${id}`);
    setLoading(false);
  }
  return (
    <Button className="w-full" onClick={handleImportProject}>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Deploy"}
    </Button>
  );
}
