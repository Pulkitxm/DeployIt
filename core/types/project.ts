export type ImportProjectType = {
  projectName: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  rootDir: string;
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
