import { Redis } from "ioredis";

const { REDIS_URL } = process.env;

let redis: Redis | null = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL);
}

export default redis;
