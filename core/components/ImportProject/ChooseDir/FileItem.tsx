import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FileItemType } from "@/types/project";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface FileItemProps {
  file: FileItemType;
  onExpand: (path: string) => Promise<void>;
  onSelect: (path: string) => void;
  isSelected: boolean;
  selectedPath: string;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onExpand,
  onSelect,
  isSelected,
  selectedPath,
}) => {
  const [isExpanded, setIsExpanded] = useState(file.isExpanded || false);
  const { theme } = useTheme();

  const handleExpand = async () => {
    if (file.type === "dir") {
      if (!isExpanded) {
        await onExpand(file.path);
      }
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li className="ml-4">
      <div
        className={`flex items-center space-x-2 ${isSelected ? (theme === "light" ? "bg-gray-200" : "bg-gray-800") : ""}`}
      >
        {file.type === "dir" ? (
          <>
            <Button
              variant="ghost"
              onClick={handleExpand}
              className="focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDown className="text-gray-500" />
              ) : (
                <ChevronRight className="text-gray-500" />
              )}
            </Button>
            <input
              type="radio"
              name="directory"
              checked={selectedPath === file.path}
              onChange={() => onSelect(file.path)}
              className="mr-2"
            />
            <span
              className="cursor-pointer"
              onClick={() => onSelect(file.path)}
            >
              {file.name}
            </span>
          </>
        ) : (
          <span>{file.name}</span>
        )}
      </div>
      {isExpanded && file.children && (
        <ul className="ml-4">
          {file.children.map((child) => (
            <FileItem
              key={child.path}
              file={child}
              onExpand={onExpand}
              onSelect={onSelect}
              isSelected={isSelected}
              selectedPath={selectedPath}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
