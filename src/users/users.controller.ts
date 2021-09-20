import { Body, Controller, Post } from "@nestjs/common";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/create")
  async createUser(
    @Body("name") name: string,
    @Body("email") email: string,
    @Body("password") password: string,
  ) {
    const user = await this.usersService.insertUser(name, email, password);
    return user;
  }
}
