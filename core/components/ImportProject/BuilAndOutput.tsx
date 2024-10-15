"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImportProjectType } from "@/types/project";

export default function BuilAndOutput({
  importProjectData,
  setImportProjectData,
}: {
  importProjectData: ImportProjectType;
  setImportProjectData: React.Dispatch<React.SetStateAction<ImportProjectType>>;
}) {
  return (
    <Collapsible
      open={importProjectData.build.open}
      onOpenChange={() =>
        setImportProjectData((prev) => ({
          ...prev,
          build: { ...prev.build, open: !prev.build.open },
        }))
      }
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
        >
          Build and Output Settings
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${importProjectData.build.open ? "rotate-180 transform" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        <Input
          placeholder="Build Command"
          value={importProjectData.build.buildCommand}
          onChange={(e) =>
            setImportProjectData((prev) => ({
              ...prev,
              build: { ...prev.build, buildCommand: e.target.value },
            }))
          }
        />
        <Input
          placeholder="Build Folder"
          value={importProjectData.build.buildDir}
          onChange={(e) =>
            setImportProjectData((prev) => ({
              ...prev,
              build: { ...prev.build, buildDir: e.target.value },
            }))
          }
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
