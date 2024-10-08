import React from "react";
import { FileItem } from "./FileItem";
import { FileItemType } from "@/types/project";

interface FileTreeProps {
  files: FileItemType[];
  onExpand: (path: string) => Promise<void>;
  onSelect: (path: string) => void;
  selectedPath: string;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  onExpand,
  onSelect,
  selectedPath,
}) => {
  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <React.Fragment key={file.path}>
          <FileItem
            file={file}
            onExpand={onExpand}
            onSelect={onSelect}
            isSelected={file.path === selectedPath}
            selectedPath={selectedPath}
          />
        </React.Fragment>
      ))}
    </ul>
  );
};
