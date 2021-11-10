import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailNotification } from "../mail-notifications/mail-notification.model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendBulkEmail(
    docs: MailNotification[],
    totalSentCount: number,
    maxSendingLimit: number,
  ): Promise<number> {
    for (let i = 0; i < docs.length; i++) {
      if (totalSentCount >= maxSendingLimit) {
        break;
      }

      try {
        const recipient = docs[i].recipient;
        const subject = docs[i].subject;
        const template = docs[i].template;
        const context = docs[i].context;

        await this.sendEmail({ to: recipient, subject, template, context });
        docs[i].status = "Success";
        docs[i].sent_logs.push({
          status: docs[i].status,
          process_time: new Date(),
          message: "Successfully Sent!",
        });
        docs[i].process_time = new Date();
        totalSentCount++;
      } catch (err) {
        docs[i].status = "Failed";
        docs[i].sent_logs.push({
          status: docs[i].status,
          process_time: new Date(),
          message: err.message,
        });
      }
      docs[i]
        .save()
        .then((_) => {})
        .catch((e) => {
          console.log(e);
        });
    }

    return totalSentCount;
  }

  async sendEmail({
    to,
    subject,
    template,
    context,
  }: {
    to: string;
    subject: string;
    template: string;
    context: object;
  }): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
