import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OrderItem } from "src/orders-items/order-item.model";
import { OrdersItemsService } from "src/orders-items/orders-items.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./oder.model";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
    private readonly orderItemsService: OrdersItemsService,
  ) {}

  async createOrder(data: CreateOrderDto, userId: string): Promise<Order> {
    const orderItemIds = await this.orderItemsService.createOrderItem(
      data.orderItems,
    );
    const order: Order = new this.orderModel({
      user: userId,
      orderItems: orderItemIds,
    });

    await order.save();

    return order;
  }
}
