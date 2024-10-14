import { z } from "zod";

export type ImportProjectType = {
  projectName: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  rootDir: string;
  branch: string;
  build: {
    open: boolean;
    buildCommand: string;
    installCommand: string;
  };
  env: {
    open: boolean;
    values: {
      key: string;
      value: string;
    }[];
  };
};

export type FileItemType = {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: FileItemType[];
  isExpanded?: boolean;
};

export enum SORT_ORDER {
  most_recent = "most_recent",
  least_recent = "least_recent",
}
export enum VIEW_MODE {
  grid = "grid",
  list = "list",
}

export const validateLogsZod = z.array(
  z.object({
    value: z.string(),
    timestamp: z.string().transform((val) => new Date(val)),
  }),
);
