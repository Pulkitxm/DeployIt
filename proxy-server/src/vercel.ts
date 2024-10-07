import { list } from "@vercel/blob";

import dotenv from "dotenv";
dotenv.config();

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

(async () => {
  const response = await list({
    token: BLOB_READ_WRITE_TOKEN,
  });
  console.log(response);
})();
