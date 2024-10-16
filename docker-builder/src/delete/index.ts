import { deleteFiles, getAllFilesList } from "../build/aws";
import { AWS_S3_BUCKET } from "../envVars";

export async function deleteProject(projectId: string) {
  const files = await getAllFilesList(AWS_S3_BUCKET!, projectId + "/");
  if (!files || files.length === 0) {
    console.error("No files to delete");
    process.exit(1);
  }
  deleteFiles(files, projectId + "/");
  console.log("Deleted project files");
}
