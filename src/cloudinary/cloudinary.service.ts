import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import toStream = require("buffer-to-stream");

@Injectable()
export class CloudinaryService {
  async uploadImage(
    folderName: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const folder = `Shop/${folderName}`;
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
