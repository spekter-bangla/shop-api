import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateOrderItemDto } from "./dto/create-orderitems.dto";
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

  @Post("/create")
  async createOrderItem(
    @Res() res,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    const orderItem = await this.orderItemsService.createOrderItem([
      createOrderItemDto,
    ]);

    return res.status(HttpStatus.OK).json({
      message: "Order Items has been created successfully",
      orderItem,
    });
  }
}
