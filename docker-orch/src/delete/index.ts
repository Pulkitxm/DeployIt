import Docker from "dockerode";
import { DeleteProject, ImportProject } from "../project";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY,
  dokcerImage,
} from "../envVars";
import { markAsDeleted, updateStatusToDb } from "../db";
import { printLiveLogs } from "../logs";
import { PROJECT_STATUS } from "../types/project";

export async function handleDeleteProjectDocker(importProject: DeleteProject) {
  console.log("Deleting Docker container:", importProject.projectId);
  const docker = new Docker({});
  const options: Docker.ContainerCreateOptions = {
    Image: dokcerImage,
    name: "deployit-delete-" + importProject.projectId,
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
    await updateStatusToDb(
      importProject.projectId,
      PROJECT_STATUS.DELETE_PENDING,
    );

    printLiveLogs(container, importProject.projectId, "delete", async () => {
      await markAsDeleted(importProject.projectId);
    });
    await container.wait();
  } catch (error) {
    await updateStatusToDb(
      importProject.projectId,
      PROJECT_STATUS.DELETE_FAILED,
    );
    console.error("Error creating or starting container:", error);
  }
}

function generateEnvConfig(importProject: DeleteProject) {
  const envVars = [
    { name: "BREAK_COUNT", value: 150 },
    { name: "AWS_ACCESS_KEY_ID", value: AWS_ACCESS_KEY_ID! },
    { name: "AWS_SECRET_ACCESS_KEY", value: AWS_SECRET_ACCESS_KEY! },
    { name: "AWS_REGION", value: AWS_REGION! },
    { name: "AWS_S3_BUCKET", value: AWS_S3_BUCKET! },
    { name: "PROJECT_ID", value: importProject.projectId },
    { name: "OPERATION", value: "DELETE" },
  ];
  return envVars
    .filter(({ value }) => value)
    .map(({ name, value }) => `${name}=${value}`);
}
