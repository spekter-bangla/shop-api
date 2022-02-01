import { BadRequestException, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 } from "uuid";

export const SingleFileUploadInterceptor = (
  allowedExts: string[],
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
    fileFilter: function (_, file, cb) {
      const { mimetype } = file;
      const validExt = allowedExts.some((ext) => mimetype.includes(ext));

      if (!validExt) {
        return cb(
          new BadRequestException(
            `Only ${allowedExts.join("/")} file allowed!`,
          ),
          false,
        );
      }

      return cb(null, true);
    },
    limits: {
      fileSize: maxFileSize,
    },
  });
};
