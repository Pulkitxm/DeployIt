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
    installCommand: z.string(),
    buildDir: z.string().default("dist"),
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
  projectSlug: z.string(),
});

export type ImportProject = z.infer<typeof validateImportProject>;
