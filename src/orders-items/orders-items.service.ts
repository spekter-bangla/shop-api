import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { createOrderItemDto } from "./dto/create-orderitems.dto";
import { OrderItem } from "./order-item.model";

@Injectable()
export class OrdersItemsService {
  constructor(
    @InjectModel("OrderItem") private readonly orderitemModel: Model<OrderItem>,
  ) {}

  async findAllOrderItem(): Promise<OrderItem[]> {
    return this.orderitemModel.find().populate({
      path: "product",
      populate: {
        path: "category",
        model: "Category",
      },
    });
  }

  async findSingleOrderItem(id: string): Promise<OrderItem> {
    const orderItem = await this.orderitemModel
      .findById(id)
      .populate("product");
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with this id:  ${id} not found`);
    }
    return orderItem;
  }

  async createOrderItem(
    createOrderItemDto: createOrderItemDto,
  ): Promise<OrderItem> {
    const { quantity, product } = createOrderItemDto;

    const newOrderItem = new this.orderitemModel({
      quantity,
      product,
    });

    const orderItemREsult = await newOrderItem.save();
    return orderItemREsult;
  }
}
