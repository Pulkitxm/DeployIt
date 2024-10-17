import { addLogsToDB, updateStatusToDb } from "./db";
import Docker from "dockerode";
import { PROJECT_STATUS } from "./types/project";

export async function printLiveLogs(
  container: Docker.Container,
  dbId: string,
  finalOP?: () => Promise<void> | void,
) {
  const logsStream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 100,
  });

  const logs: string[] = [];

  logsStream.on("data", async (chunk) => {
    const logData = chunk.toString("utf8").trim() as string;
    const cleanedLogData = logData
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (cleanedLogData) {
      logs.push(cleanedLogData);
    }
  });

  logsStream.on("end", async () => {
    if (logs.length > 0) {
      await addLogsToDB(dbId, logs.slice(2));
    }
    if (finalOP) await finalOP();
    console.log("Logs added to DB");
  });
}
