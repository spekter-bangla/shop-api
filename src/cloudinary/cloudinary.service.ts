import { Express } from "express";
import * as fs from "fs";
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
      const upload = v2.uploader.upload_stream(
        {
          folder,
          quality: 50,
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  uploadImages(
    folderName: string,
    files: Array<Express.Multer.File>,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const folder = `Shop/${folderName}`;
    const uploadPromises: Array<
      Promise<UploadApiResponse | UploadApiErrorResponse>
    > = [];

    files.forEach((file) => {
      const promise: Promise<UploadApiResponse | UploadApiErrorResponse> =
        new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream(
            {
              folder,
              quality: 50,
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) return resolve(result);
            },
          );
          toStream(file.buffer).pipe(upload);
        });
      uploadPromises.push(promise);
    });

    return Promise.all(uploadPromises);
  }

  deleteImages(
    imagePublicIds: string[],
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.api.delete_resources(imagePublicIds, (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result);
      });
    });
  }

  async uploadRawFile(
    folderName: string,
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const folder = `Shop/${folderName}`;
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        filePath,
        {
          folder,
          quality: 50,
          resource_type: "raw",
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) {
            fs.unlink(filePath, function (err) {
              if (err) {
                console.log(err);
                return;
              }
              // console.log("File deleted!");
            });
            return resolve(result);
          }
        },
      );
    });
  }
}
