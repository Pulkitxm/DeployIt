import { ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../helpers/aws";
import { AWS_S3_BUCKET } from "../envVars";

export async function getAllFilesList(bucketName: string, prefix: string) {
  const files: string[] = [];

  async function fetchFiles(prefix: string) {
    const command = new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: "/",
    });

    const res = await s3Client.send(command);

    if (res.CommonPrefixes) {
      for (const commonPrefix of res.CommonPrefixes) {
        await fetchFiles(commonPrefix.Prefix!);
      }
    }

    if (res.Contents) {
      const newFiles = res.Contents.filter(
        (file) => file.Size && file.Size > 0 && file.Key,
      ).map((file) => file.Key!);
      files.push(...newFiles);
    }
  }

  await fetchFiles(prefix);
  return files;
}

export async function deleteFiles(files: string[],prefix: string) {
  console.log(`Deleting files: ${files}`);
  for (const file of files) {
    const deleteCommannd = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET!,
      Key: file,
    });
    await s3Client.send(deleteCommannd);
    console.log(`Deleted ${file}`);
  }
  const deleteCommannd = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET!,
    Key: prefix,
  });
  await s3Client.send(deleteCommannd);
  console.log(`Deleted ${prefix}`);
}
