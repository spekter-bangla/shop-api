import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { CreateUserDto } from "../users/dto/create-user-dto";
import { ResponseBody } from "../utils/ResponseBody";
import { User } from "../users/user.model";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(
    @Request() req,
  ): Promise<ResponseBody<{ accessToken: string; user: User }>> {
    const { accessToken } = await this.authService.createAccessToken(req.user);

    return {
      message: "Successfully Logged In!",
      data: { accessToken, user: req.user },
    };
  }

  @Post("/register")
  async register(
    @Body() registerData: CreateUserDto,
  ): Promise<ResponseBody<User>> {
    const user = await this.authService.createUser(registerData);

    return {
      message:
        "Registration Successfull, Verification Mail Has Been Sent To Your Email Address, Please Verify Your Email Address!",
      data: user,
    };
  }

  @Get("/verify/:id")
  async verifyUser(@Param("id") id: string): Promise<ResponseBody> {
    const varified = await this.authService.varifyUser(id);

    if (!varified) {
      throw new BadRequestException("Link has expired!");
    }

    return {
      message: "Successfully Verified!",
    };
  }

  @Get("/forgotpassword")
  async forgotPassword(@Query("email") email: string): Promise<ResponseBody> {
    if (!email) {
      throw new BadRequestException("Please Provide Your Email Address");
    }

    await this.authService.forgotPassword(email);

    return {
      message: `An email has been sent to ${email} with further instructions.`,
    };
  }

  @Post("/changepassword")
  async changeForgotPassword(
    @Body() { key, newPassword }: { key: string; newPassword: string },
  ): Promise<ResponseBody> {
    if (!key || !newPassword) {
      throw new BadRequestException("Please Provide Key and New Password");
    }

    await this.authService.changeForgotPassword(key, newPassword);

    return {
      message: "Password Successfully Changed",
    };
  }
}
