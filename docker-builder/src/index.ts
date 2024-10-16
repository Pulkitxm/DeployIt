import { buildAndCLone } from "./build";
import { deleteProject } from "./delete";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY,
  GITHUB_TOKEN,
  OPERATION,
  PROJECT_ID,
  REPO_URL,
} from "./envVars";

if (!OPERATION) {
  console.error("Error: Missing environment variables.");
  process.exit(1);
} else {
  if (OPERATION === "BUILD") {
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
    } else {
      buildAndCLone();
    }
  } else if (OPERATION === "DELETE") {
    if (
      !PROJECT_ID ||
      !AWS_ACCESS_KEY_ID ||
      !AWS_SECRET_ACCESS_KEY ||
      !AWS_REGION ||
      !AWS_S3_BUCKET
    ) {
      console.log({
        AWS_ACCESS_KEY_ID,
        AWS_REGION,
        AWS_S3_BUCKET,
        AWS_SECRET_ACCESS_KEY,
        OPERATION,
        PROJECT_ID,
      });
      console.error("Error: aMissing environment variables.");
      process.exit(1);
    } else {
      deleteProject(PROJECT_ID);
    }
  } else {
    console.error("Error: Invalid operation.");
    process.exit(1);
  }
}
