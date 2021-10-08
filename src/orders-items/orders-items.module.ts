import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { OrderItemSchema } from "./order-item.model";
import { OrdersItemsController } from "./orders-items.controller";
import { OrdersItemsService } from "./orders-items.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "OrderItem", schema: OrderItemSchema }]),
    CloudinaryModule,
  ],
  controllers: [OrdersItemsController],
  providers: [OrdersItemsService],
  exports: [OrdersItemsService],
})
export class OrdersItemsModule {}
