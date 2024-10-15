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
    buildDir: string;
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
export type LogsType = z.infer<typeof validateLogsZod>;

export const validateFrojectUpdateFormType = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),

  slug: z.string().min(1, {
    message: "Slug is required.",
  }),
  private: z.boolean(),
});

export type ProjectUpdateFormType = z.infer<
  typeof validateFrojectUpdateFormType
>;
