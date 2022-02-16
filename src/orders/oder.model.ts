import { Schema, Document } from "mongoose";

export enum OrderStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      { type: Schema.Types.ObjectId, ref: "OrderItem", required: true },
    ],
    status: { type: String, enum: OrderStatus, default: OrderStatus.OPEN },
  },
  {
    timestamps: true,
  },
);

export interface Order extends Document {
  user: string;
  orderItems: string[];
  status: OrderStatus;
}
