import dotenv from "dotenv";

dotenv.config();

export const dokcerImage = process.env.DOCKER_IMAGE;
export const REDIS_URL = process.env.REDIS_URL;
