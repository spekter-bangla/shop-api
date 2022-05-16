import { Schema, Document } from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      { type: Schema.Types.ObjectId, ref: "OrderItem", required: true },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.IN_PROGRESS,
    },
  },
  {
    timestamps: true,
  },
);

export interface Order extends Document {
  user: string;
  orderItems: string[];
  totalPrice: number;
  status: OrderStatus;
}
