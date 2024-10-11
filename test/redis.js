import dotenv from "dotenv";

dotenv.config();

import { Redis } from "ioredis";

const { REDIS_URL, REDIS_PORT, REDIS_PASSWORD } = process.env;

let redis = new Redis(REDIS_URL);

redis.on("error", (err) => {
  console.log("Redis error:", err);
});

redis.on("connect", async () => {
  console.log("Redis connected");
  while (true) {
    const res = await redis.brpop("project_import_queue", 0);
    console.log(res);
  }
});
