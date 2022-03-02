import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { OrderItemSchema } from "../orders-items/order-item.model";
import { OrdersItemsService } from "../orders-items/orders-items.service";
import { OrderSchema } from "./oder.model";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Order", schema: OrderSchema },
      { name: "OrderItem", schema: OrderItemSchema },
    ]),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersItemsService],
  exports: [OrdersService, OrdersItemsService],
})
export class OrdersModule {}
