import Redis from "ioredis";
import { REDIS_URL } from "./envVars";

let redisClient: Redis | null = null;

async function getRedisClient() {
  console.log("Connecting to Redis");
  if (!redisClient) {
    console.log(REDIS_URL);
    redisClient = new Redis(REDIS_URL ?? "redis://127.0.0.1:6379");
  }
  return redisClient;
}

export async function publishEvent(
  channel: string,
  message: string,
  expiry?: number,
) {
  try {
    const redis = await getRedisClient();
    if (expiry) {
      await redis.set(channel, message, "EX", expiry);
    } else {
      await redis.set(channel, message);
    }
  } catch (error) {
    console.error(`Error publishing event to channel ${channel}:`, error);
  }
}

export async function getEvent(channel: string) {
  try {
    const redis = await getRedisClient();
    const message = await redis.get(channel);
    return message;
  } catch (error) {
    console.error(`Error getting event from channel ${channel}:`, error);
    return null;
  }
}

export async function leftPushEvent(channel: string, message: string) {
  try {
    const redis = await getRedisClient();
    await redis.rpush(channel, message);
  } catch (error) {
    console.error(`Error pushing event to channel ${channel}:`, error);
  }
}
