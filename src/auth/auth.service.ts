import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../users/user.model";
import { UsersService } from "../users/users.service";
import { RedisService } from "../redis/redis.service";
import { MailNotificationService } from "../mail-notifications/mail-notifications.service";
import { CreateUserDto } from "../users/dto/create-user-dto";
import { createVerifyEmailLink } from "../utils/createEmailLink";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private mailNotificationService: MailNotificationService,
  ) {}
  async createUser(createUserData: CreateUserDto) {
    if (await this.usersService.doesUserExists(createUserData)) {
      throw new BadRequestException("Email already exists");
    }

    const user = await this.usersService.insertUser(createUserData);
    const url = await createVerifyEmailLink(
      process.env.FRONTEND_HOST!,
      user._id,
      this.redisService,
    );
    // save to notification
    await this.mailNotificationService.create([
      {
        user: user._id,
        recipient: user.email,
        subject: "Verify Your Email Address",
        template: "./confirmation",
        context: {
          url,
          name: user.name,
        },
        schedule: "Emergency",
      },
    ]);
    this.mailNotificationService.sendBySchedule("Emergency");

    return user;
  }

  async varifyUser(id: string): Promise<boolean> {
    const userId = await this.redisService.get(id);

    if (!userId) {
      return false;
    }

    await this.usersService.updateOne({ _id: userId }, { verified: true });
    await this.redisService.del(id);

    return true;
  }

  async getUserById(userId) {
    return this.usersService.findById(userId);
  }

  async validateUser(email: string, password: string): Promise<User | string> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      return "Email/Password doesn't match!";
    }

    const valid = await user.validatePassword(password);

    if (!valid) {
      return "Email/Password doesn't match!";
    }

    if (!user.verified) {
      return "Please Verify Your Email Address First!";
    }

    return user;
  }

  async createAccessToken(user: User) {
    const payload = { userId: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
