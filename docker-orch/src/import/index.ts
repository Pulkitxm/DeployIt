import { updateStatusToDb } from "../db";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY,
  dokcerImage,
} from "../envVars";
import { printLiveLogs } from "../logs";
import { ImportProject } from "../project";
import Docker from "dockerode";
import { v4 as uuid } from "uuid";
import { PROJECT_STATUS } from "../types/project";

export const handleProjectImportViaDocker = async (
  importProject: ImportProject,
) => {
  const docker = new Docker({});

  const options: Docker.ContainerCreateOptions = {
    Image: dokcerImage,
    name: "deployit-build-" + importProject.projectId,
    Env: generateEnvConfig(importProject),
    HostConfig: {
      NetworkMode: "host",
      Memory: 500 * 1024 * 1024,
      CpuCount: 2,
      CpuPeriod: 100000,
      CpuQuota: 100000,
    },
  };

  console.log("Creating Docker container with options:", options);

  try {
    const container = await docker.createContainer(options);
    await container.start();
    await updateStatusToDb(importProject.dbId, PROJECT_STATUS.BUILD_PENDING);

    printLiveLogs(container, importProject.dbId, "build");
    await container.wait();
  } catch (error) {
    console.error("Error creating or starting container:", error);
  }
};

const generateEnvConfig = (importProject: ImportProject): string[] => {
  const envVars = [
    { name: "PROJECT_EXPORT_DIR", value: "deployit-exports" + uuid() },
    { name: "BREAK_COUNT", value: 150 },
    { name: "AWS_ACCESS_KEY_ID", value: AWS_ACCESS_KEY_ID },
    { name: "AWS_SECRET_ACCESS_KEY", value: AWS_SECRET_ACCESS_KEY },
    { name: "AWS_REGION", value: AWS_REGION },
    { name: "AWS_S3_BUCKET", value: AWS_S3_BUCKET },
    { name: "REPO_OWNER", value: importProject.repoOwner },
    { name: "REPO_NAME", value: importProject.repoName },
    { name: "BUILD_FOLDER", value: importProject.build.buildDir },
    { name: "ROOT_DIR", value: importProject.rootDir },
    { name: "GITHUB_TOKEN", value: importProject.GITHUB_TOKEN },
    { name: "BRANCH", value: importProject.branch },
    { name: "PROJECT_ID", value: importProject.projectId },
    { name: "BUILD_COMMAND", value: importProject.build.buildCommand },
    { name: "OPERATION", value: "BUILD" },
  ];

  for (const [key, { value }] of Object.entries(importProject.env.values)) {
    envVars.push({ name: key, value });
  }

  return envVars
    .filter(({ value }) => value)
    .map(({ name, value }) => `${name}=${value}`);
};
