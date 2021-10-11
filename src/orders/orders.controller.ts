import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("/create")
  @UseGuards(JwtAuthGuard)
  async createOrderItem(@Req() req, @Body() data: CreateOrderDto) {
    return this.ordersService.createOrder(data, req.user._id);
  }
}
