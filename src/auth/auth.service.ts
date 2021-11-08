import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../users/user.model";
import { UsersService } from "../users/users.service";
import { MailService } from "../mail/mail.service";
import { CreateUserDto } from "../users/dto/create-user-dto";
import { makeId } from "../utils/makeId";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async createUser(createUserData: CreateUserDto) {
    if (await this.usersService.doesUserExists(createUserData)) {
      return {
        message: "User already exists",
      };
    }

    const user = await this.usersService.insertUser(createUserData);
    await this.mailService.sendUserConfirmation(user, makeId(6));

    return {
      message:
        "Registration Successfull, Verification Mail Has Been Sent To Your Email Address, Please Verify Your Email Address!",
      user,
    };
  }

  async getUserById(userId) {
    return this.usersService.findById(userId);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      return null;
    }

    const valid = await user.validatePassword(password);

    if (!valid) {
      return null;
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
