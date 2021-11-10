import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DeleteResult } from "mongodb";

import { MailNotification, Schedule } from "./mail-notification.model";
import { MailService } from "../mail/mail.service";

@Injectable()
export class MailNotificationService {
  constructor(
    @InjectModel("MailNotification")
    private readonly mailNotificationModel: Model<MailNotification>,
    private readonly mailService: MailService,
  ) {}
  async sendBySchedule(schedule: Schedule): Promise<number> {
    const maxSendingLimit = parseInt(process.env.MAX_MAIL_SEND_LIMIT!) | 50;
    let count = 0;

    if (count < maxSendingLimit) {
      const pendingDocs = await this.mailNotificationModel
        .find({
          schedule,
          status: "Pending",
        })
        .sort({ createdAt: -1 })
        .limit(maxSendingLimit - count);

      if (pendingDocs.length > 0) {
        count = await this.mailService.sendBulkEmail(
          pendingDocs,
          count,
          maxSendingLimit,
        );
      }

      if (count < maxSendingLimit) {
        const failedDocs = await this.mailNotificationModel
          .find({
            schedule,
            status: "Failed",
          })
          .sort({ createdAt: -1 })
          .limit(maxSendingLimit - count);

        if (failedDocs.length > 0) {
          count = await this.mailService.sendBulkEmail(
            failedDocs,
            count,
            maxSendingLimit,
          );
        }
      }
    }

    return count;
  }

  async create(data: Partial<MailNotification>[]) {
    return this.mailNotificationModel.insertMany(data);
  }

  async findById(id: string): Promise<MailNotification | null> {
    const [result] = await this.mailNotificationModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          let: {
            thisDocKey: "$user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$thisDocKey"],
                },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return result;
  }

  async getAll(): Promise<MailNotification[]> {
    const result = await this.mailNotificationModel.aggregate([
      {
        $lookup: {
          from: "users",
          let: {
            thisDocKey: "$user",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$thisDocKey"],
                },
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return result;
  }

  async delete(id: string): Promise<DeleteResult> {
    const mailNotification = await this.findById(id);

    if (!mailNotification) {
      throw new NotFoundException("MailNotification Not Found");
    }

    return this.mailNotificationModel.deleteOne({ _id: id });
  }
}
