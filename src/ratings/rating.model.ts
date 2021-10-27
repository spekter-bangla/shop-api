import { Schema, Document } from "mongoose";

const RatingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  {
    timestamps: true,
  },
);

RatingSchema.index({ user: 1, product: 1 }, { unique: true });

export { RatingSchema };

export interface Rating extends Document {
  user: string;
  product: string;
  rating: number;
}
