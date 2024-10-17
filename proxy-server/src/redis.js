import Redis from "ioredis";
import { REDIS_URL } from "./envVars.js";

const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

export async function getDetails(slug) {
  try {
    return await redis.get(slug);
  } catch (err) {
    console.error("Error retrieving data from Redis:", err.message);
    return null;
  }
}

export async function setDetails(slug, value, expiry) {
  try {
    await redis.set(slug, value, "EX", expiry);
  } catch (err) {
    console.error("Error setting data in Redis:", err.message);
  }
}

export default redis;
