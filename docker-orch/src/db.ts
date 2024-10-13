import { Client } from "pg";
import { DATABASE_URL } from "./envVars";

const client = new Client(DATABASE_URL);

client.connect();

// export async function addLogs(log:string)
