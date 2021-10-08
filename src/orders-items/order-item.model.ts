import { Schema, Document } from "mongoose";

export const OrderItemSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export interface OrderItem extends Document {
  quantity: number;
}
