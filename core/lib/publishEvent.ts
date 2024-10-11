import redis from "./redis";

export async function publishEvent(channel: string, message: string) {
  try {
    if (!redis) throw new Error("Redis not initialized");
    await redis.publish(channel, message);
    console.log(`Event published to channel ${channel}`);
  } catch (error) {
    console.error(`Error publishing event to channel ${channel}:`, error);
  }
}
