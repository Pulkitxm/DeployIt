import path from "path";
import fs from "fs";

export function getFilesFromDirRec(
  dir: string,
): string[] {
  const files: string[] = [];

  const getFilesRec = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(process.cwd(), filePath);
      if (fs.lstatSync(filePath).isDirectory()) {
        getFilesRec(filePath);
      } else {
        files.push(relativePath);
      }
    }
  };

  getFilesRec(dir);
  console.log("Files found:", files);
  return files;
}

export function getSize(files: string[]) {
  let size = 0;
  for (const file of files) {
    size += fs.statSync(file).size;
  }
  return size;
}

export function getFormatedSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return size.toFixed(index === 0 ? 0 : 2) + units[index];
}
