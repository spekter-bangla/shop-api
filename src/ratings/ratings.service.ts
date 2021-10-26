import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { CreateRatingDto } from "./dtos/create-rating.dto";

import { Rating } from "./rating.model";

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel("Rating") private readonly ratingModel: Model<Rating>,
  ) {}

  async createRating(
    userId: string,
    createRatingData: CreateRatingDto,
  ): Promise<Rating> {
    const { productId, rate } = createRatingData;

    // check if already rated
    const userRating = await this.ratingModel.findOne({
      user: userId,
      product: productId,
    });

    if (!userRating) {
      const newRating = new this.ratingModel({
        user: userId,
        product: productId,
        rate,
      });

      return newRating.save();
    }

    // user already rated, now want to update
    userRating.rate = rate;
    return userRating.save();
  }

  // async getProductRating(productId: string): Promise<number> {
  //   return this.ratingModel.findById(id);
  // }
}
