import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;

export const BASE_PATH = process.env.BASE_PATH;
export const NOT_FOUND_PATH = process.env.NOT_FOUND_PATH;
export const REDIS_URL = process.env.REDIS_URL;

export const CACHE_EXPIRY = 60 * 2;
