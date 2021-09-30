import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.model";
import { CreateCategoryDto } from "./dtos/create-category-dto";

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("image", {
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
        fileSize: 3 * 1024 * 1024,
      },
    }),
  )
  @Post("/create")
  async createCategory(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Category> {
    if (!file) {
      throw new BadRequestException("Please provide category image");
    }
    const fileUploadedResult = await this.cloudinaryService.uploadImage(
      "Category",
      file,
    );

    const category = await this.categoriesService.create({
      ...body,
      image: fileUploadedResult.url,
    });

    return category;
  }
}
