import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateRatingDto } from "./dtos/create-rating.dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RatingsService } from "./ratings.service";
import { ProductsService } from "../products/products.service";

@Controller("ratings")
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post("/create")
  async rateProduct(@Req() req, @Body() createRatingData: CreateRatingDto) {
    // check product exists
    const isProductExists = await this.productsService.isProductExists(
      createRatingData.productId,
    );

    if (!isProductExists) {
      throw new BadRequestException(
        "The Product doesnot exists in our system!",
      );
    }

    const ratingInfo = await this.ratingsService.createRating(
      req.user._id,
      createRatingData,
    );

    this.productsService.updateProductRating(
      ratingInfo.product,
      ratingInfo.avg_rating,
    );

    return ratingInfo;
  }
}
