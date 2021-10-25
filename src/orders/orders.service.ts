import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { addPagination, PaginationResult } from "../utils/addPagination";
import { OrdersItemsService } from "../orders-items/orders-items.service";
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

  async findAllMyOrders(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginationResult<Order>> {
    const [result] = await this.orderModel.aggregate([
      {
        $match: { user: new Types.ObjectId(userId) },
      },
      {
        $unwind: {
          path: "$orderItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "orderitems",
          let: {
            thisDocKey: "$orderItems",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$thisDocKey"],
                },
              },
            },
            {
              $lookup: {
                from: "products",
                let: {
                  thisDocKey: "$product",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$thisDocKey"],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: "subcategories",
                      let: {
                        thisDocKey: "$category",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ["$_id", "$$thisDocKey"],
                            },
                          },
                        },
                      ],
                      as: "category",
                    },
                  },
                  {
                    $unwind: {
                      path: "$category",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
                as: "product",
              },
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "orderItems",
        },
      },
      {
        $unwind: {
          path: "$orderItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          orderItems: {
            $push: "$orderItems",
          },
          status: {
            $first: "$status",
          },
          createdAt: {
            $first: "$createdAt",
          },
          updatedAt: {
            $first: "$updatedAt",
          },
        },
      },
      ...addPagination(page, limit),
    ]);

    return result;
  }

  async findSingleOrder(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate("orderItems user");

    if (!order) {
      throw new NotFoundException(`Order with this id:  ${id} not found`);
    }
    return order;
  }
}
