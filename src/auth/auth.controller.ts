import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { CreateUserDto } from "../users/dto/create-user-dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req) {
    const { accessToken } = await this.authService.createAccessToken(req.user);

    return { accessToken, user: req.user };
  }

  @Post("/register")
  async register(@Body() registerData: CreateUserDto) {
    return this.authService.createUser(registerData);
  }
}
