import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RatingsController } from "./ratings.controller";
import { RatingsService } from "./ratings.service";
import { RatingSchema } from "./rating.model";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Rating", schema: RatingSchema }]),
    ProductsModule,
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
