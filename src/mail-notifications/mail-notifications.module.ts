import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MailNotificationController } from "./mail-notifications.controller";
import { MailNotificationService } from "./mail-notifications.service";
import { MailNotificationSchema } from "./mail-notification.model";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "MailNotification", schema: MailNotificationSchema },
    ]),
  ],
  controllers: [MailNotificationController],
  providers: [MailNotificationService],
  exports: [MailNotificationService],
})
export class MailNotificationModule {}
