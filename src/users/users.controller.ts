import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user-dto";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/create")
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    if (await this.usersService.doesUserExists(createUserDto)) {
      return res.status(HttpStatus.OK).json({
        message: "User already exists",
      });
    }

    const user = await this.usersService.insertUser(createUserDto);
    return res.status(HttpStatus.OK).json({
      message: "User has been created successfully",
      user,
    });
  }
}
