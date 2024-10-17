import { updateStatusToDb } from "../db";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_S3_ENDPOINT,
  AWS_SECRET_ACCESS_KEY,
  BUILD_TIMEOUT,
  dockerImage,
  MEMORY_LIMIT,
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
    Image: dockerImage,
    name: "deployit-build-" + importProject.projectId,
    Env: generateEnvConfig(importProject),
    HostConfig: {
      NetworkMode: "host",
      // Memory: MEMORY_LIMIT,
      // CpuCount: 2,
    },
  };

  console.log("Creating Docker container with options:", options);

  try {
    const container = await docker.createContainer(options);
    await container.start();
    await updateStatusToDb(importProject.dbId, PROJECT_STATUS.BUILD_PENDING);

    const buildProcess = new Promise<void>(async (resolve, reject) => {
      try {
        printLiveLogs(container, importProject.dbId);
        await container.wait();
        const containerInfo = await container.inspect();
        console.log("Container exit code:", containerInfo.State);
        await updateStatusToDb(
          importProject.dbId,
          containerInfo.State.ExitCode === 0
            ? PROJECT_STATUS.BUILD_SUCCESS
            : PROJECT_STATUS.BUILD_FAILED,
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("BUILD_TIMEOUT")), BUILD_TIMEOUT),
    );

    await Promise.race([buildProcess, timeout]);
  } catch (error) {
    console.error("Error during build process:", error);
    if (error instanceof Error && error.message === "BUILD_TIMEOUT") {
      await updateStatusToDb(importProject.dbId, PROJECT_STATUS.BUILD_TIMEOUT);
      const container = docker.getContainer(
        "deployit-build-" + importProject.projectId,
      );
      try {
        await container.stop();
        console.log(
          `Container stopped due to timeout: deployit-build-${importProject.projectId}`,
        );
      } catch (stopError) {
        console.error(
          `Failed to stop container: deployit-build-${importProject.projectId}`,
          stopError,
        );
      }
    } else {
      await updateStatusToDb(importProject.dbId, PROJECT_STATUS.BUILD_FAILED);
    }
  }
};

const generateEnvConfig = (importProject: ImportProject): string[] => {
  const envVars = [
    { name: "PROJECT_EXPORT_DIR", value: "deployit-exports" + uuid() },
    { name: "BREAK_COUNT", value: 150 },
    { name: "AWS_ACCESS_KEY_ID", value: AWS_ACCESS_KEY_ID },
    { name: "AWS_SECRET_ACCESS_KEY", value: AWS_SECRET_ACCESS_KEY },
    { name: "AWS_S3_ENDPOINT", value: AWS_S3_ENDPOINT },
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
