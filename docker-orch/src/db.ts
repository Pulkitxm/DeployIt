import { Client } from "pg";
import { DATABASE_URL } from "./envVars";

const client = new Client(DATABASE_URL);

client.connect().then(async () => {
  console.log("connected to database");
});

export async function addLogs(projectId: string, log: string) {
  const query = `
        UPDATE "Project"
        SET logs = array_append(logs, jsonb_build_object('value', $1::text, 'timestamp', NOW()))
        WHERE id = $2
        RETURNING logs;
    `;

  try {
    await client.query(query, [log, projectId]);
  } catch (err) {
    console.error("Error updating logs:", err);
  }
}
