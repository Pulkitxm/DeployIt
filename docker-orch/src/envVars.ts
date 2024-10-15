import dotenv from "dotenv";

dotenv.config();

export const dokcerImage = process.env.DOCKER_IMAGE;
export const REDIS_URL = process.env.REDIS_URL;
export const DATABASE_URL=process.env.DATABASE_URL

export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;