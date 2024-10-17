import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_S3_BUCKET, maxBuildSize, PROJECT_EXPORT_DIR } from "../envVars";
import { getFilesFromDirRec, getFormatedSize, getSize } from "./file";
import { s3Client } from "../helpers/aws";

async function uploadFileToS3(
  projectId: string,
  bucketName: string,
  filePath: string,
  key: string,
) {
  const ContentType = mime.lookup(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: projectId + "/" + key,
    Body: fs.createReadStream(filePath),
    ContentType: !ContentType ? "application/octet-stream" : ContentType,
    ACL: "public-read",
  });
  await s3Client.send(command);
}

export async function uploadBuildDirContents(
  projectId: string,
  buildDir: string,
) {
  const files = getFilesFromDirRec(buildDir);
  const sizeOfBuildDir = getSize(files);
  const formatedSizeOfBuildDir = getFormatedSize(sizeOfBuildDir);
  // console.log("Size of build dir: " + formatedSizeOfBuildDir);

  if (sizeOfBuildDir > maxBuildSize) {
    console.log("Size of build dir is too big, try with smaller files.");
    process.exit(1);
  }

  for (const file of files) {
    await uploadFileToS3(
      projectId,
      AWS_S3_BUCKET!,
      file,
      file.replace(PROJECT_EXPORT_DIR + "/", ""),
    );
  }
}
