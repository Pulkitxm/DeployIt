import { Pool } from "pg";
import { DATABASE_URL } from "./envVars";

const pool = new Pool({ connectionString: DATABASE_URL });

export async function addLogsToDB(
  projectId: string,
  logs: string[],
): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const query = `
          UPDATE "Project"
          SET logs = array_append(logs, jsonb_build_object('value', $1::text, 'timestamp', NOW()))
          WHERE id = $2;
      `;

    const promises = logs.map((log) => client.query(query, [log, projectId]));
    await Promise.all(promises);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating logs:", err);
  } finally {
    client.release();
  }
}

export async function updateStatusToDb(projectId: string, status: string) {
  try {
    const query = `
      UPDATE "Project"
      SET status = $1
      WHERE id = $2
    `;
    await pool.query(query, [status, projectId]);
  } catch (err: any) {
    console.error("Error updating status:", err.message);
  }
}
