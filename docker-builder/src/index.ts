import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY,
  GITHUB_TOKEN,
  PROJECT_ID,
  REPO_URL,
} from "./envVars";
import { buildAndCLone } from "./helper/build";

if (
  !GITHUB_TOKEN ||
  !REPO_URL ||
  !PROJECT_ID ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_REGION ||
  !AWS_S3_BUCKET
) {
  console.error("Error: Missing environment variables.");
  process.exit(1);
}

buildAndCLone();
