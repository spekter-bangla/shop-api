import { Module } from '@nestjs/common';
import { OrdersItemsController } from './orders-items.controller';
import { OrdersItemsService } from './orders-items.service';

@Module({
  controllers: [OrdersItemsController],
  providers: [OrdersItemsService]
})
export class OrdersItemsModule {}
