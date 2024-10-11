import {
  BRANCH,
  BUILD_COMMAND,
  BUILD_FOLDER,
  exportProjectDir,
  GITHUB_TOKEN,
  REPO_URL,
  repoUrlFromSecret,
  workDir,
} from "../envVars";
import { runCommand } from "../helper/shell";
import { cloneRepo } from "./git";
import { executeProcess } from "./process";

export const buildAndCLone = async () => {
  try {
    await executeProcess(
      async function () {
        if (!REPO_URL || !GITHUB_TOKEN || !BRANCH) {
          console.error("Error: Missing environment variables.");
          return process.exit(1);
        }
        await cloneRepo(repoUrlFromSecret, BRANCH);
      },
      {
        initialLog: "Cloning repository from Github",
        finalLog: `Project cloned`,
      },
    );

    await executeProcess(
      async function () {
        await runCommand({
          command: "npm install",
          cwd: workDir,
        });
      },
      {
        initialLog: "Installing dependencies",
        finalLog: `Successfully installed dependencies`,
      },
    );

    await executeProcess(
      async function () {
        if (!BUILD_COMMAND) {
          console.error("Error: Missing BUILD_COMMAND");
          process.exit(1);
        }
        console.log("Building the project", BUILD_COMMAND);
        await runCommand({
          command: BUILD_COMMAND,
          cwd: workDir,
        });
      },
      {
        initialLog: "Building the project",
        finalLog: `Successfully cloned, installed dependencies, and built the project`,
      },
    );

    console.log("Successfully built the project");

    await executeProcess(async function () {
      await runCommand({
        command: `mv '${workDir}/${BUILD_FOLDER}/'* '${exportProjectDir}'`,
        cwd: workDir,
      });
      console.log(exportProjectDir);
    }, {});
  } catch (err: Error | any) {
    console.error(`Failed to complete the process: ${err.message}`);
    process.exit(1);
  }
};
