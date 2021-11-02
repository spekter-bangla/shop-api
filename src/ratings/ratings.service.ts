import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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
  ): Promise<Rating & { avg_rating: number }> {
    const { productId, rating } = createRatingData;

    let ratingInfo: (Rating & { avg_rating?: number }) | null;

    // check if already rated
    ratingInfo = await this.ratingModel.findOne({
      user: userId,
      product: productId,
    });

    if (!ratingInfo) {
      // user giving rating for the first time
      ratingInfo = new this.ratingModel({
        user: userId,
        product: productId,
        rating,
      });

      ratingInfo.save();
    } else {
      // user already rated, now want to update
      ratingInfo.rating = rating;
      await ratingInfo.save();
    }

    // add avg_rate
    const [{ avg_rating }] = await this.ratingModel.aggregate([
      {
        $match: { product: new Types.ObjectId(productId) },
      },
      {
        $group: {
          _id: "$product",
          avg_rating: { $avg: "$rating" },
        },
      },
    ]);

    return { ...ratingInfo.toJSON(), avg_rating } as any;
  }
}
