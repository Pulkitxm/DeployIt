import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { basename } from "path";

import dotenv from "dotenv";
dotenv.config();

// Configure the S3 client
const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://974666f398d49d0e8c8a899ccc9d9cf7.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  },
});

async function uploadImageToR2(
  filePath: string,
  bucketName: string,
  Key: string,
) {
  const fileStream = createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    console.log(`File uploaded successfully. ETag: ${response.ETag}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Usage
const filePath = "./output/index.html";
const bucketName = "vercel-clone";

uploadImageToR2(filePath, bucketName, "index.html");
