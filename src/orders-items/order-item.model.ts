import { Schema, Document } from "mongoose";

export interface OrderItem extends Document {
  quantity: number;
}
