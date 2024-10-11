import { dokcerImage as DOCKER_IMAGE } from "./envVars";
import { ImportProject, validateImportProject } from "./project";
import redis from "./redis";
import Docker from "dockerode";
import fs from "fs";

const loopHandler = async () => {
  if (!redis) {
    return;
  }
  while (true) {
    const res = await redis.brpop("project_import_queue", 0);
    if (!res) {
      continue;
    }
    const message = res[1];
    console.log(message);
    const parsedMessage = validateImportProject.safeParse(JSON.parse(message));
    if (parsedMessage.success) {
      console.log(parsedMessage.data);
      await handleProjectImportViaDocker(parsedMessage.data);
    } else {
      console.log(parsedMessage.error.issues);
    }
  }
};

const handleProjectImportViaDocker = async (importProject: ImportProject) => {
  const docker = new Docker({});
  try {
    const res = await docker.getContainer("devpulkit").remove({ force: true });
    console.log(`Container deleted ${res.toString()}`);
  } catch (err) {}

  const options: Docker.ContainerCreateOptions = {
    Image: DOCKER_IMAGE,
    name: "devpulkit",
    Env: [
      `REPO_OWNER=${importProject.repoOwner}`,
      `REPO_NAME=${importProject.repoName}`,
      `BUILD_FOLDER=${importProject.build.buildDir}`,
    ],
    HostConfig: {
      AutoRemove: false,
      NetworkMode: "host",
    },
  };
  if (importProject.rootDir) {
    options.Env?.push(`ROOT_DIR=${importProject.rootDir}`);
  }
  if (importProject.build.buildCommand) {
    options.Env?.push(`BUILD_COMMAND=${importProject.build.buildCommand}`);
  }
  if (importProject.build.installCommand) {
    options.Env?.push(`INSTALL_COMMAND=${importProject.build.installCommand}`);
  }
  if (importProject.GITHUB_TOKEN) {
    options.Env?.push(`GITHUB_TOKEN=${importProject.GITHUB_TOKEN}`);
  }
  if (importProject.branch) {
    options.Env?.push(`BRANCH=${importProject.branch}`);
  }

  for (const [key, { value }] of Object.entries(importProject.env.values)) {
    options.Env?.push(`${key}=${value}`);
  }

  console.log(options);

  const container = await docker.createContainer(options);
  await container.start();

  printLiveLogs(container);

  // detect if container is stopped
  await container.wait();
};

async function printLiveLogs(container: Docker.Container) {
  const logsStream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 100,
  });

  logsStream.on("data", (chunk) => {
    let logData = chunk.toString("utf8").replace(/[^\x20-\x7E]/g, "");
    if (logData.length > 0) {
      logData = logData + "\n";
    }
    fs.appendFileSync("./test/log.log", logData, { encoding: "utf8" });
    console.log(logData);
  });
}

fs.rm("./test/log.log", { force: true }, () => {});

redis?.on("error", (err) => {
  console.log("Error from redis:", err);
  process.exit(1);
});

redis?.on("ready", () => {
  loopHandler();
});

// handleProjectImportViaDocker({
//   projectName: "My Portfolio",
//   repoName: "devpulkit.in",
//   repoOwner: "pulkitxm",
//   rootDir: "/",
//   branch: "reactv",
//   build: {
//     open: false,
//     buildCommand: "",
//     installCommand: "",
//     buildDir: "dist",
//   },
//   env: { open: false, values: [] },
//   GITHUB_TOKEN: "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",
// });
