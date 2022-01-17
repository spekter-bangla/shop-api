import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { RedisModule } from "./redis/redis.module";
import { MailModule } from "./mail/mail.module";
import { MailNotificationModule } from "./mail-notifications/mail-notifications.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { OrdersModule } from "./orders/orders.module";
import { OrdersItemsModule } from "./orders-items/orders-items.module";
import { ProductsModule } from "./products/products.module";
import { SubCategoriesModule } from "./sub-categories/sub-categories.module";
import { RatingsModule } from "./ratings/ratings.module";
import { CarouselModule } from "./carousels/carousels.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    RedisModule,
    MailModule,
    MailNotificationModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    OrdersItemsModule,
    ProductsModule,
    SubCategoriesModule,
    RatingsModule,
    CarouselModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
