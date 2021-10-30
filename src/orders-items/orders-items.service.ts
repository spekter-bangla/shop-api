import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AllCustomErrors } from "../utils/product.custom-errors";
import { CreateOrderItemDto } from "./dto/create-orderitems.dto";
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
    const isvalidId = Types.ObjectId.isValid(id);
    if (!isvalidId) {
      throw new NotFoundException(AllCustomErrors.invalidObjectIdError);
    }
    const orderItem = await this.orderitemModel
      .findById(id)
      .populate("product");
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with this id:  ${id} not found`);
    }
    return orderItem;
  }

  async createOrderItem(
    createOrderItemDtos: CreateOrderItemDto[],
  ): Promise<any> {
    const orderItems = await this.orderitemModel.insertMany(
      createOrderItemDtos,
    );
    const orderItemIds = orderItems.reduce((acc: string[], curr) => {
      const { _id } = curr;
      acc = [...acc, `${_id}`];
      return acc;
    }, []);

    return orderItemIds;
  }
}
