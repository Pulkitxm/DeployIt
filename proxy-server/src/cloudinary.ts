import fs from "fs/promises";
import dotenv from "dotenv";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const data: any[] = [];

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "cloud_name";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "api_key";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "api_secret";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadObject({ objectPath }: { objectPath: string }) {
  try {
    const object = await fs.readFile(objectPath);

    // Use Promise to handle Cloudinary stream correctly
    return new Promise((resolve, reject) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          public_id: objectPath,
          use_filename: true,
          resource_type: "raw",
          chunk_size: 4000000,
          use_asset_folder_as_public_id_prefix: true,
          overwrite: true,
        },
        function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier
        .createReadStream(object)
        .pipe(cld_upload_stream)
        .on("error", (error: any) => {
          reject(error);
        });
    });
  } catch (err) {
    console.error(`Error reading file ${objectPath}:`, err);
    throw err;
  }
}

const getUrlOfCloudinaryAsset = (asset: any) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/v${asset.version}/${asset.public_id}`;
};

const getFilesRecursively = async (directory: string): Promise<string[]> => {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = `${directory}/${dirent.name}`;
      return dirent.isDirectory() ? getFilesRecursively(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
};
(async () => {
  try {
    const folderObjects = await getFilesRecursively("output");

    const files = (
      await Promise.all(
        folderObjects.map(async (file) => {
          const stat = await fs.stat(file);
          return stat.isFile() ? file : null;
        }),
      )
    )
      .filter(Boolean)
      .filter((file) => file != null);

    for (const file of files) {
      console.log(`Uploading file: ${file}`);
      const result: any = await uploadObject({ objectPath: file });
      data.push({
        url: getUrlOfCloudinaryAsset(result),
        version: result.version,
        public_id: result.public_id,
      });
    }
  } catch (error) {
    console.error("Error processing files:", error);
  }
})().then(() => {
  console.log(data);
});
