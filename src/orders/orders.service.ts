import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { addPagination, PaginatedResult } from "../utils/addPagination";
import { OrdersItemsService } from "../orders-items/orders-items.service";
import { ProductsService } from "../products/products.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./oder.model";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
    private readonly orderItemsService: OrdersItemsService,
    private readonly productsService: ProductsService,
  ) {}

  async createOrder(data: CreateOrderDto, userId: string): Promise<Order> {
    const { orderItemIds, totalPrice } =
      await this.orderItemsService.createOrderItem(data.orderItems);

    const order: Order = new this.orderModel({
      user: userId,
      orderItems: orderItemIds,
      totalPrice,
    });

    // update product stock
    await this.productsService.updateProductStock(data.orderItems);
    await order.save();

    return order;
  }

  async findAllOrders(
    page: number,
    limit: number,
    status: string,
    userId?: string,
  ): Promise<PaginatedResult<Order>> {
    const filter: any[] = [
      {
        $match: {},
      },
    ];

    if (userId) {
      filter[0].$match["user"] = new Types.ObjectId(userId);
    }
    if (status) {
      filter[0].$match["status"] = status;
    }

    const [result] = await this.orderModel.aggregate([
      ...filter,
      {
        $lookup: {
          from: "users",
          let: {
            thisDocKey: "$user",
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
              $project: {
                password: 0,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
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
          totalPrice: {
            $first: "$totalPrice",
          },
          user: {
            $first: "$user",
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
      { $sort: { createdAt: -1 } },
      ...addPagination(page, limit),
    ]);

    return result;
  }

  async findSingleOrder(id: string): Promise<Order> {
    const [order] = await this.orderModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          let: {
            thisDocKey: "$user",
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
              $project: {
                password: 0,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
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
          totalPrice: {
            $first: "$totalPrice",
          },
          user: {
            $first: "$user",
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
    ]);

    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
  }
}
