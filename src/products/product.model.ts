import { Schema, Document } from "mongoose";

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: true, required: true },
    unitPrice: { type: Number, required: true },
    totalStock: { type: Number, required: true },
    availableStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    images: [{ type: String, required: true }],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface Product extends Document {
  name: string;
  description: string;
  status: boolean;
  unitPrice: number;
  totalStock: number;
  availableStock: number;
  rating: number;
  images: Array<any>;
}
