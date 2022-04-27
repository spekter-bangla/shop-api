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
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../users/user.model";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("/me")
  async getAllMyOrders(@Req() req, @Query() query) {
    const { page = 1, limit = 40 } = query;

    const allOrders = await this.ordersService.findAllOrders(
      page,
      limit,
      req.user._id,
    );

    return {
      data: allOrders,
    };
  }

  @UseGuards(RolesGuard(Role.ADMIN))
  @Get("/")
  async getAllOrders(@Query() query) {
    const { page = 1, limit = 40 } = query;

    const allOrders = await this.ordersService.findAllOrders(page, limit);

    return {
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
  async createOrder(@Req() req, @Body() data: CreateOrderDto) {
    return this.ordersService.createOrder(data, req.user._id);
  }
}
