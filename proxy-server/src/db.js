import pkg from "pg";
import { DATABASE_URL } from "./envVars.js";

const { Client } = pkg;
const client = new Client(DATABASE_URL);

client.connect().then(async () => {
  console.log("connected to database");
});

export async function getProjectDetails(projectSlug) {
  try {
    const query = `
      SELECT id,private,status FROM "Project"
      WHERE slug = $1
    `;
    const res = await client.query(query, [projectSlug]);
    console.log(res);
    if (!res) return null;
    const id = res.rows[0].id;
    increaeVisitCount(id);
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
    const res = await client.query(query, [projectId]);
    return res.rows[0].id;
  } catch (err) {
    console.error("Error fetching project ID from database:", err.message);
    return null;
  }
}
