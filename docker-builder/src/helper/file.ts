import path from "path";
import fs from "fs";
import ignore from "ignore";

export function getFilesFromDirRec(
  dir: string,
  ignorePatterns: string[],
): string[] {
  const files: string[] = [];
  const ig = ignore().add(ignorePatterns);

  const getFilesRec = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), filePath);

      if (fs.lstatSync(filePath).isDirectory()) {
        if (!ig.ignores(relativePath)) {
          getFilesRec(filePath);
        }
      } else {
        if (!ig.ignores(relativePath)) {
          files.push(relativePath);
        }
      }
    }
  };

  getFilesRec(dir);
  console.log("Files found:", files);
  return files;
}

export function getFormatedSize(size: number) {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
}
