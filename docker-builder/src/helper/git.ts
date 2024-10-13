import path from "path";
import fs from "fs";
import simpleGit from "simple-git";
import { ignorePatterns, projectDir } from "../envVars";

const git = simpleGit();

export async function cloneRepo(repoUrl: string, branch: string) {
  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true });
  } else {
    fs.mkdirSync(projectDir);
  }

  await git.clone(repoUrl, projectDir);

  await git.cwd(projectDir);
  await git.checkout(branch);
}

export function recursiveSearchFor(
  currentDir: string,
  fileName: string,
): string | undefined {
  const gitignorePath = path.join(currentDir, fileName);
  if (fs.existsSync(gitignorePath)) {
    return gitignorePath;
  }
  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) {
    return undefined;
  }
  return recursiveSearchFor(parentDir, fileName);
}

export function getGitignorePatterns(dir: string): string[] {
  const gitignorePath = recursiveSearchFor(dir, ".gitignore");
  if (gitignorePath && fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ignorePatterns.push(
      ...gitignoreContent
        .split("\n")
        .filter((line) => line && !line.startsWith("#")),
    );
  }
  return ignorePatterns;
}
