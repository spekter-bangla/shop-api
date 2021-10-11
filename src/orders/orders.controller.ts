import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("/")
  async getAllOrder() {
    const orderAll = await this.ordersService.findAllOrders();
    return {
      status: "Success",
      data: orderAll,
    };
  }

  @Get("/:id")
  async getSingleOrder(@Param("id") id: string) {
    const order = await this.ordersService.findSingleOrder(id);
    return {
      status: "Success",
      data: order,
    };
  }

  @Post("/create")
  @UseGuards(JwtAuthGuard)
  async createOrderItem(@Req() req, @Body() data: CreateOrderDto) {
    return this.ordersService.createOrder(data, req.user._id);
  }
}
