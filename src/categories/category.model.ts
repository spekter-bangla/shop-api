import { Schema, Document } from "mongoose";

export const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: true, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Category extends Document {
  name: string;
  description: string;
  status: boolean;
  image: string;
}
