import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
export const ROOT_DIR = process.env.ROOT_DIR;
export const BUILD_FOLDER = process.env.BUILD_FOLDER;
export const BUILD_COMMAND = process.env.BUILD_COMMAND ?? "npm run build";
export const BRANCH = process.env.BRANCH;
export const PROJECT_EXPORT_DIR = process.env.PROJECT_EXPORT_DIR ?? "project";
export const PROJECT_SLUG = process.env.PROJECT_SLUG;

export const repoUrlFromSecret = `https://${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git`;
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

export const projectDir = path.join(__dirname, "../project");
export const workDir = ROOT_DIR ? path.join(projectDir, ROOT_DIR) : projectDir;
export const exportProjectDir = path.join(
  __dirname,
  "../" + PROJECT_EXPORT_DIR,
);
export const logFile = exportProjectDir;

[projectDir, exportProjectDir, logFile].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  } else {
    fs.rmSync(dir, { recursive: true });
    fs.mkdirSync(dir);
  }
});


export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;



console.log({
  GITHUB_TOKEN,
  REPO_OWNER,
  REPO_NAME,
  ROOT_DIR,
  BUILD_FOLDER,
  BUILD_COMMAND,
  BRANCH,
  PROJECT_EXPORT_DIR,
  PROJECT_SLUG,
  repoUrlFromSecret,
  REPO_URL,
  projectDir,
  workDir,
  exportProjectDir,
  logFile,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
})