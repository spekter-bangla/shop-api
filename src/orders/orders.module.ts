import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderItemSchema } from "../orders-items/order-item.model";
import { OrdersItemsService } from "../orders-items/orders-items.service";
import { OrderSchema } from "./oder.model";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Order", schema: OrderSchema },
      { name: "OrderItem", schema: OrderItemSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersItemsService],
  exports: [OrdersService, OrdersItemsService],
})
export class OrdersModule {}
