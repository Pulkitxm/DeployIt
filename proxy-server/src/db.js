import pkg from "pg";
import { DATABASE_URL } from "./envVars.js";

const { Client } = pkg;

export async function getProjectDetails(projectSlug) {
  try {
    const query = `
      SELECT id,private,status FROM "Project"
      WHERE slug = $1
    `
      .trim()
      .replace(/\s+/g, " ");
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    const res = await client.query(query, [projectSlug]);
    if (!res) return null;
    const id = res.rows[0].id;
    increaeVisitCount(id);
    await client.end();
    return { id, private: res.rows[0].private, status: res.rows[0].status };
  } catch (err) {
    console.error("Error fetching project ID from database:", err.message);
    return null;
  }
}
export async function increaeVisitCount(projectId) {
  try {
    const query = `
      UPDATE "Project"
      SET "views" = "views" + 1
      WHERE id = $1
    `;
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    const res = await client.query(query, [projectId]);
    await client.end();
    return res.rows[0].id;
  } catch (err) {
    console.error("Error fetching project ID from database:", err.message);
    return null;
  }
}
