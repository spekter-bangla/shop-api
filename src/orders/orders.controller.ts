import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("/")
  async getAllMyOrders(@Req() req, @Query() query) {
    const { page = 1, limit = 40 } = query;

    const allOrders = await this.ordersService.findAllMyOrders(
      req.user._id,
      page,
      limit,
    );
    return {
      status: "Success",
      data: allOrders,
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
  async createOrderItem(@Req() req, @Body() data: CreateOrderDto) {
    return this.ordersService.createOrder(data, req.user._id);
  }
}
