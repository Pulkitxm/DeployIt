import { dokcerImage } from "./envVars";
import { ImportProject, validateImportProject } from "./project";
import redis from "./redis";
import Docker from "dockerode";
import fs from "fs";
import { v4 as uuid } from "uuid";

const logFilePath = "./test/log.log";

const loopHandler = async () => {
  if (!redis) return;

  while (true) {
    try {
      const res = await redis.brpop("project_import_queue", 0);
      if (!res) continue;

      const message = res[1];
      console.log("Received message:", message);

      const parsedMessage = validateImportProject.safeParse(
        JSON.parse(message),
      );
      if (parsedMessage.success) {
        console.log("Validated project data:", parsedMessage.data);
        await handleProjectImportViaDocker(parsedMessage.data);
      } else {
        console.error("Validation error:", parsedMessage.error.issues);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
};

const handleProjectImportViaDocker = async (importProject: ImportProject) => {
  const docker = new Docker({});
  try {
    await docker.getContainer("devpulkit").remove({ force: true });
    console.log("Previous container 'devpulkit' removed successfully.");
  } catch (err: any) {
    console.warn(
      "No existing container to remove or failed removal:",
      err.message,
    );
  }

  const options: Docker.ContainerCreateOptions = {
    Image: dokcerImage,
    name: "test-vercel-builder",
    Env: generateEnvConfig(importProject),
    HostConfig: {
      AutoRemove: false,
      NetworkMode: "host",
    },
  };

  console.log("Creating Docker container with options:", options);

  try {
    const container = await docker.createContainer(options);
    await container.start();
    printLiveLogs(container);
    await container.wait();

    const logs = await container.logs({ stdout: true, stderr: true });
    console.log("Container logs:", logs.toString());
  } catch (error) {
    console.error("Error creating or starting container:", error);
  }
};

const generateEnvConfig = (importProject: ImportProject): string[] => {
  const envVars = [
    { name: "PROJECT_EXPORT_DIR", value: "deployit-exports"+uuid() },
    { name: "BREAK_COUNT", value: 150 },
    { name: "REPO_OWNER", value: importProject.repoOwner },
    { name: "REPO_NAME", value: importProject.repoName },
    { name: "BUILD_FOLDER", value: importProject.build.buildDir },
    { name: "ROOT_DIR", value: importProject.rootDir },
    { name: "GITHUB_TOKEN", value: importProject.GITHUB_TOKEN },
    { name: "BRANCH", value: importProject.branch },
    { name: "PROJECT_SLUG", value: importProject.projectSlug },
    { name: "BUILD_COMMAND", value: importProject.build.buildCommand },
    { name: "INSTALL_COMMAND", value: importProject.build.installCommand },
  ];

  for (const [key, { value }] of Object.entries(importProject.env.values)) {
    envVars.push({ name: key, value });
  }

  return envVars
    .filter(({ value }) => value)
    .map(({ name, value }) => `${name}=${value}`);
};

async function printLiveLogs(container: Docker.Container) {
  const logsStream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 100,
  });

  logsStream.on("data", (chunk) => {
    const logData = chunk.toString("utf8").trim();
    const cleanedLogData = logData
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
      .replace(/[^\x20-\x7E]/g, "") // Remove non-printable ASCII characters
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim();

    if (cleanedLogData) {
      fs.appendFileSync("./test/log.log", cleanedLogData + "\n", {
        encoding: "utf8",
      });
    }
  });
}

fs.rm(logFilePath, { force: true }, () => {
  console.log("Previous log file removed.");
});

redis?.on("error", (err) => {
  console.error("Error from Redis:", err);
  process.exit(1);
});

redis?.on("ready", () => {
  console.log("Redis is ready, starting loop handler.");
  loopHandler();
});
