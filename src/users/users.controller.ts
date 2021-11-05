import { Body, Controller, Post } from "@nestjs/common";

import { UsersService } from "./users.service";
import { MailService } from "../mail/mail.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { makeId } from "../utils/makeId";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private mailService: MailService,
  ) {}

  @Post("/create")
  async createUser(@Body() createUserData: CreateUserDto) {
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
}
