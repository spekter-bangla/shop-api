import { Schema, Document } from "mongoose";

export const CarouselSchema = new Schema(
  {
    image: { type: String, required: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Carousel extends Document {
  image: string;
  url: string;
}
