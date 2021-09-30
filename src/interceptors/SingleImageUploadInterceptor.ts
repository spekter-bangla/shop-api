import { BadRequestException, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

export const SingleImageUploadInterceptor = (
  maxFileSize: number,
): Type<NestInterceptor<any, any>> => {
  return FileInterceptor("image", {
    fileFilter: function (_, file, cb) {
      const { mimetype } = file;

      if (!["image/jpeg", "image/jpg", "image/png"].includes(mimetype)) {
        return cb(
          new BadRequestException("Only jpg/jpeg/png file allowed!"),
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
