import { GITHUB_TOKEN, REPO_URL } from "./envVars";
import { buildAndCLone } from "./helper/build";

if (!GITHUB_TOKEN || !REPO_URL) {
  console.error("Error: Missing environment variables.");
  process.exit(1);
}

buildAndCLone();
