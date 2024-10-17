import { S3Client } from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_ENDPOINT,
  AWS_SECRET_ACCESS_KEY,
} from "../envVars";

export const s3Client = new S3Client({
  endpoint: AWS_S3_ENDPOINT!,
  region: AWS_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});
