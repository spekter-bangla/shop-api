import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SubCategoriesController } from "./sub-categories.controller";
import { SubCategoriesService } from "./sub-categories.service";
import { SubCategorySchema } from "./sub-category.model";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "SubCategory", schema: SubCategorySchema },
    ]),
    CloudinaryModule,
    CategoriesModule,
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
