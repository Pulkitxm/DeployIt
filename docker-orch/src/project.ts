import { z } from "zod";

export const validateImportProject = z.object({
  dbId: z.string(),
  projectName: z.string(),
  repoName: z.string(),
  repoOwner: z.string(),
  rootDir: z.string(),
  branch: z.string(),
  build: z.object({
    open: z.boolean(),
    buildCommand: z.string(),
    buildDir: z.string(),
  }),
  env: z.object({
    open: z.boolean(),
    values: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    ),
  }),
  GITHUB_TOKEN: z.string(),
  projectId: z.string(),
});

export type ImportProject = z.infer<typeof validateImportProject>;
