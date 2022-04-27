import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ProductsService } from "../products/products.service";
import { CreateOrderItemDto } from "./dto/create-orderitems.dto";
import { OrderItem } from "./order-item.model";

@Injectable()
export class OrdersItemsService {
  constructor(
    @InjectModel("OrderItem") private readonly orderitemModel: Model<OrderItem>,
    private readonly productsService: ProductsService,
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
      throw new NotFoundException(`OrderItem with this id: ${id} not found`);
    }
    return orderItem;
  }

  async createOrderItem(createOrderItemDtos: CreateOrderItemDto[]) {
    const productIds = createOrderItemDtos.map((item) => item.product);
    const stock = await this.productsService.getProductAvailableStock(
      productIds,
    );
    const stockData = stock.reduce((acc, curr) => {
      acc[curr._id] = curr.availableStock;
      return acc;
    }, {});
    const unitPriceData = stock.reduce((acc, curr) => {
      acc[curr._id] = curr.unitPrice;
      return acc;
    }, {});

    const errorMessage: any = {};
    let totalPrice = 0;

    for (let i = 0; i < createOrderItemDtos.length; i++) {
      const item = createOrderItemDtos[i];
      if (stockData[item.product]) {
        totalPrice = totalPrice + item.quantity * unitPriceData[item.product];
        if (stockData[item.product] < item.quantity) {
          errorMessage[item.product] = `Only ${
            stockData[item.product]
          } available to purchase right now!`;
        }
      } else {
        errorMessage[item.product] = "Not available to purchase right now!";
      }
    }

    if (Object.keys(errorMessage).length > 0) {
      throw new BadRequestException({ message: errorMessage });
    }

    // at this point everything is good to order
    const orderItems = await this.orderitemModel.insertMany(
      createOrderItemDtos,
    );
    const orderItemIds = orderItems.reduce((acc: string[], curr) => {
      const { _id } = curr;
      acc = [...acc, `${_id}`];
      return acc;
    }, []);

    return { orderItemIds, totalPrice };
  }
}
