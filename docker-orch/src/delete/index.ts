import Docker from "dockerode";
import { DeleteProject } from "../project";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_S3_ENDPOINT,
  AWS_SECRET_ACCESS_KEY,
  DELETE_TIMEOUT,
  dockerImage,
} from "../envVars";
import { markAsDeleted, updateStatusToDb } from "../db";
import { printLiveLogs } from "../logs";
import { PROJECT_STATUS } from "../types/project";

export async function handleDeleteProjectDocker(deleteProject: DeleteProject) {
  console.log("Deleting Docker container:", deleteProject.projectId);
  const docker = new Docker({});
  const options: Docker.ContainerCreateOptions = {
    Image: dockerImage,
    name: "deployit-delete-" + deleteProject.projectId,
    Env: generateEnvConfig(deleteProject),
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
      deleteProject.projectId,
      PROJECT_STATUS.DELETE_PENDING,
    );

    const deleteProcess = new Promise<void>(async (resolve, reject) => {
      try {
        printLiveLogs(container, deleteProject.projectId);
        await container.wait();
        const containerInfo = await container.inspect();
        console.log("Container exit code:", containerInfo.State.ExitCode);
        if (containerInfo.State.ExitCode === 0) {
          await markAsDeleted(deleteProject.projectId);
        } else {
          await markAsDeleted(deleteProject.projectId);
          await updateStatusToDb(
            deleteProject.projectId,
            PROJECT_STATUS.DELETE_FAILED,
          );
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DELETE_TIMEOUT")), DELETE_TIMEOUT),
    );

    await Promise.race([deleteProcess, timeout]);
  } catch (error) {
    console.error("Error during delete process:", error);
    if (error instanceof Error && error.message === "DELETE_TIMEOUT") {
      await updateStatusToDb(
        deleteProject.projectId,
        PROJECT_STATUS.DELETE_TIMEOUT,
      );
      const container = docker.getContainer(
        "deployit-delete-" + deleteProject.projectId,
      );
      try {
        await container.stop();
        console.log(
          `Container stopped due to timeout: deployit-delete-${deleteProject.projectId}`,
        );
      } catch (stopError) {
        console.error(
          `Failed to stop container: deployit-delete-${deleteProject.projectId}`,
          stopError,
        );
      }
    } else {
      await updateStatusToDb(
        deleteProject.projectId,
        PROJECT_STATUS.DELETE_FAILED,
      );
    }
  }
}

function generateEnvConfig(deleteProject: DeleteProject): string[] {
  const envVars = [
    { name: "BREAK_COUNT", value: "150" },
    { name: "AWS_ACCESS_KEY_ID", value: AWS_ACCESS_KEY_ID },
    { name: "AWS_SECRET_ACCESS_KEY", value: AWS_SECRET_ACCESS_KEY },
    { name: "AWS_REGION", value: AWS_REGION },
    { name: "AWS_S3_ENDPOINT", value: AWS_S3_ENDPOINT },
    { name: "AWS_S3_BUCKET", value: AWS_S3_BUCKET },
    { name: "PROJECT_ID", value: deleteProject.projectId },
    { name: "OPERATION", value: "DELETE" },
  ];
  return envVars
    .filter(({ value }) => value !== undefined)
    .map(({ name, value }) => `${name}=${value}`);
}
