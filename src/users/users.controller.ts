import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user-dto";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/create")
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.insertUser(createUserDto);
    return user;
  }
}
