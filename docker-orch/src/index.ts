import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY,
  dokcerImage,
} from "./envVars";
import { printLiveLogs } from "./logs";
import { ImportProject, validateImportProject } from "./project";
import redis from "./redis";
import Docker from "dockerode";
import { v4 as uuid } from "uuid";

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

  const options: Docker.ContainerCreateOptions = {
    Image: dokcerImage,
    name: "deployit-" + importProject.projectId,
    Env: generateEnvConfig(importProject),
    HostConfig: {
      NetworkMode: "host",
    },
  };

  console.log("Creating Docker container with options:", options);

  try {
    const container = await docker.createContainer(options);
    await container.start();
    
    printLiveLogs(container, importProject.dbId);
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
  ];

  for (const [key, { value }] of Object.entries(importProject.env.values)) {
    envVars.push({ name: key, value });
  }

  return envVars
    .filter(({ value }) => value)
    .map(({ name, value }) => `${name}=${value}`);
};


redis?.on("error", (err) => {
  console.error("Error from Redis:", err);
  process.exit(1);
});

redis?.on("ready", () => {
  console.log("Redis is ready, starting loop handler.");
  loopHandler();
});
