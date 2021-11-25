import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";

import { ResponseBody } from "../utils/ResponseBody";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MailNotificationService } from "./mail-notifications.service";
import { MailNotification } from "./mail-notification.model";
import { PaginatedResult } from "../utils/addPagination";
import { Role } from "../users/user.model";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("mailnotifications")
@UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
export class MailNotificationController {
  constructor(
    private readonly mailNotificationService: MailNotificationService,
  ) {}

  @Get("/")
  async getAllMailNotifications(
    @Query() query,
  ): Promise<ResponseBody<PaginatedResult<MailNotification>>> {
    const { page = 1, limit = 40 } = query;

    const allMailNotifications = await this.mailNotificationService.getAll(
      page,
      limit,
    );

    return {
      message: "All Mail Notifications!",
      data: allMailNotifications,
    };
  }

  @Get("/:id")
  async getSingleMailNotification(
    @Param("id") id: string,
  ): Promise<ResponseBody<MailNotification>> {
    const mailNotification = await this.mailNotificationService.findById(id);

    if (!mailNotification) {
      throw new NotFoundException("Mail Notification Not Found!");
    }

    return {
      message: "Mail Notification Found!",
      data: mailNotification,
    };
  }
}
