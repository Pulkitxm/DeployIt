import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  PROJECT_EXPORT_DIR,
  PROJECT_SLUG,
} from "../envVars";
import { getFilesFromDirRec, getFormatedSize, getSize } from "./file";

const s3Client = new S3Client({
  region: AWS_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
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
  console.log(
    "File uploaded successfully: " +
      filePath +
      ", key: " +
      PROJECT_SLUG +
      "/" +
      key,
  );
}

export async function uploadBuildDirContents(buildDir: string) {
  console.log("Uploading files from: " + buildDir);
  const files = getFilesFromDirRec(buildDir);
  const sizeOfBuildDir = getFormatedSize(getSize(files));
  console.log("Size of build dir: " + sizeOfBuildDir);
  for (const file of files) {
    await uploadFileToS3(
      "test-vultr",
      file,
      file.replace(PROJECT_EXPORT_DIR + "/", ""),
    );
  }
  console.log("Total files uploaded: " + files.length);
}
