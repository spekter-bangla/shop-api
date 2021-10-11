import { Schema, Document } from "mongoose";

export const SubCategorySchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: true, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  {
    timestamps: true,
  },
);

export interface SubCategory extends Document {
  name: string;
  description: string;
  status: boolean;
  image: string;
  category: string;
}
