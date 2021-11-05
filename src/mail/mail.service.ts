import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

import { User } from "../users/user.model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Welcome to Nice App! Confirm your Email",
      template: "./confirmation", // `.ejs` extension is appended automatically
      context: {
        name: user.name,
        url,
      },
    });
  }
}
