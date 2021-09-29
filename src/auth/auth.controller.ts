import { Controller, Post, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/")
  async login(@Request() req) {
    const { accessToken } = await this.authService.createAccessToken(req.user);

    return { accessToken, user: req.user };
  }
}
