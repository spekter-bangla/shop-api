import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { CategoriesModule } from "../categories/categories.module";
import { ProductSchema } from "./product.model";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }]),
    CloudinaryModule,
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
