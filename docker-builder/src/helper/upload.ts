import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PROJECT_EXPORT_DIR, PROJECT_SLUG } from "../envVars";
import { getGitignorePatterns } from "./git";
import { runCommand } from "./shell";
import { getFilesFromDirRec, getFormatedSize } from "./file";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIATJB4PKLS3ROKSPEX",
    secretAccessKey: "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",
  },
});

async function uploadFileToS3(
  bucketName: string,
  filePath: string,
  key: string,
) {
  const ContentType = mime.lookup(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: PROJECT_SLUG + "/" + key,
    Body: fs.createReadStream(filePath),
    ContentType: !ContentType ? "application/octet-stream" : ContentType,
  });
  await s3Client.send(command);
}

export async function uploadBuildDirContents(buildDir: string) {
  const sizeOfBuildDir = getFormatedSize(fs.statSync(buildDir).size);
  console.log("Size of build dir: " + sizeOfBuildDir);
  console.log("Uploading files from: " + buildDir);
  await runCommand({
    command: "ls -la " + buildDir,
  });
  const ignorePatterns = getGitignorePatterns(buildDir);
  console.log("Ignoring patterns:", ignorePatterns);
  const files = getFilesFromDirRec(buildDir, ignorePatterns);
  for (const file of files) {
    await uploadFileToS3(
      "test-vultr",
      file,
      file.replace(PROJECT_EXPORT_DIR + "/", ""),
    );
    console.log(
      "Uploaded file: " + file,
      ", key: " + file.replace(PROJECT_EXPORT_DIR + "/", ""),
    );
  }
  console.log("All files uploaded successfully.");
  console.log("Total files uploaded: " + files.length);
}
