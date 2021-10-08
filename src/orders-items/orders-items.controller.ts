import { Controller, Get, Param } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { OrdersItemsService } from "./orders-items.service";

@Controller("orders-items")
export class OrdersItemsController {
  constructor(
    private readonly orderItemsService: OrdersItemsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("/")
  async getAllOrderItem() {
    const orderitemAll = await this.orderItemsService.findAllOrderItem();
    return {
      status: "Success",
      data: orderitemAll,
    };
  }

  @Get("/:id")
  async getSingleOrderItem(@Param("id") id: string) {
    const orderItem = await this.orderItemsService.findSingleOrderItem(id);
    return {
      status: "Success",
      data: orderItem,
    };
  }
}
