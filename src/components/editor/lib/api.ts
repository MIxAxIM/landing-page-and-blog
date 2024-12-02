// import { Storage } from "@google-cloud/storage";
// const {Storage} = require("@google-cloud/storage");
// const Multer = require("multer");

// const projectId = "";
// const keyFilename = "";
// const bucketName = "";

// const storage = new Storage({ projectId, keyFilename });
// const bucket = storage.bucket(bucketName);

// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // No larger than 5mb
//   },
// });

export class API {
  public static uploadImage = async (file: any) => {
    console.log("Uploading image...", file);
    await new Promise((r) => setTimeout(r, 500));
    return "/andamio.png";

    // try {
    //   if (file) {
    //     console.log("File found, trying to upload...");
    //     const blob = bucket.file(file.originalname);
    //     const blobStream = blob.createWriteStream();

    //     blobStream.on("finish", () => {
    //       console.log("Success");
    //       return true;
    //     });
    //     blobStream.end(file.buffer);
    //   } else throw "error with img";
    // } catch (error) {
    //   console.error("Error uploading image: ", error);
    //   return false;
    // }
  };
}

export default API;
