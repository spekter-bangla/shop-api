import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CategoriesModule } from "../categories/categories.module";
import { CarouselSchema } from "./carousel.model";
import { CarouselController } from "./carousels.controller";
import { CarouselService } from "./carousels.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Carousel", schema: CarouselSchema }]),
    CloudinaryModule,
    CategoriesModule,
  ],
  controllers: [CarouselController],
  providers: [CarouselService],
  exports: [CarouselService],
})
export class CarouselModule {}
