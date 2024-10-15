import { Redis } from "ioredis";
import { REDIS_URL } from "./envVars";

let redis: Redis | null = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL);

  redis.on("connect", () => {
    console.log("Connected to Redis");
  });
  
}

export default redis;
