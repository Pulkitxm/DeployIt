import { GITHUB_TOKEN, PROJECT_SLUG, REPO_URL } from "./envVars";
import { buildAndCLone } from "./helper/build";

if (!GITHUB_TOKEN || !REPO_URL || !PROJECT_SLUG) {
  console.error("Error: Missing environment variables.");
  process.exit(1);
}

buildAndCLone();
