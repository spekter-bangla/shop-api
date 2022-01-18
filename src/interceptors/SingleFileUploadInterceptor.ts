import { NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 } from "uuid";

export const SingleFileUploadInterceptor = (
  maxFileSize: number,
): Type<NestInterceptor<any, any>> => {
  return FileInterceptor("file", {
    // storage: diskStorage({
    //   destination: "./csv",
    //   filename: (_, file, callback) => {
    //     const ext = file.originalname.split(".")[1];
    //     callback(null, `${v4()}.${ext}`);
    //   },
    // }),
    limits: {
      fileSize: maxFileSize,
    },
  });
};
