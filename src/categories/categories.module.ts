import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategorySchema } from "./category.model";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }]),
    CloudinaryModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
