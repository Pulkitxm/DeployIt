"use client";

import { useState, useRef } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImportProjectType } from "@/types/project";

export default function EnvironmentVariable({
  importProjectData,
  setImportProjectData,
}: {
  importProjectData: ImportProjectType;
  setImportProjectData: React.Dispatch<React.SetStateAction<ImportProjectType>>;
}) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [pasteArea, setPasteArea] = useState("");
  const pasteAreaRef = useRef<HTMLTextAreaElement>(null);

  const addEnvVar = () => {
    if (newKey && newValue) {
      setImportProjectData((prev) => ({
        ...prev,
        env: {
          ...prev.env,
          values: [...prev.env.values, { key: newKey, value: newValue }],
        },
      }));
      setNewKey("");
      setNewValue("");
    }
  };

  const removeEnvVar = (index: number) => {
    setImportProjectData((prev) => ({
      ...prev,
      env: {
        ...prev.env,
        values: prev.env.values.filter((_, i) => i !== index),
      },
    }));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    setPasteArea(pastedText);

    const lines = pastedText.split("\n");
    const newEnvVars = lines
      .map((line) => {
        const [key, value] = line.split("=").map((item) => item.trim());
        return key && value ? { key, value } : null;
      })
      .filter(
        (envVar): envVar is { key: string; value: string } => envVar !== null,
      );

    if (newEnvVars.length > 0) {
      setImportProjectData((prev) => ({
        ...prev,
        env: {
          ...prev.env,
          values: [...prev.env.values, ...newEnvVars],
        },
      }));
      setPasteArea("");
    }
  };

  return (
    <Collapsible
      open={importProjectData.env.open}
      onOpenChange={() =>
        setImportProjectData((prev) => ({
          ...prev,
          env: { ...prev.env, open: !prev.env.open },
        }))
      }
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
        >
          Environment Variables
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              importProjectData.env.open ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mb-5 mt-2 space-y-2">
        <div className="flex space-x-2">
          <Input
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addEnvVar} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Textarea
          ref={pasteAreaRef}
          placeholder="Paste your .env content here"
          value={pasteArea}
          onChange={(e) => setPasteArea(e.target.value)}
          onPaste={handlePaste}
          className="min-h-[100px]"
        />
        {importProjectData.env.values.map((env, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input value={env.key} readOnly className="flex-1" />
            <Input value={env.value} readOnly className="flex-1" />
            <Button
              onClick={() => removeEnvVar(index)}
              variant="outline"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          TIP: Paste a .env above to populate the form
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
