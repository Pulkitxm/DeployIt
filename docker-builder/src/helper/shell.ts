import { exec } from "child_process";

export const runCommand = async ({
  command,
  cwd,
}: {
  command: string;
  cwd?: string;
}) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, { cwd });

    if (process.stdout) {
      process.stdout.on("data", (data) => {
        console.log(data.toString());
      });
    }

    if (process.stderr) {
      process.stderr.on("data", (data) => {
        console.error(`Error: ${data.toString()}`);
      });
    }

    process.on("close", (code) => {
      if (code === 0) {
        resolve(`Process completed with code ${code}`);
      } else {
        reject(new Error(`Process failed with exit code ${code}`));
      }
    });

    process.on("error", (err) => {
      reject(new Error(`Failed to start process: ${err.message}`));
    });
  });
};
