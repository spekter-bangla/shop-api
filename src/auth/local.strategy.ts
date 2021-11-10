import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "./auth.service";
import { User } from "../users/user.model";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
    }); // pass the config here
  }

  async validate(email: string, password: string): Promise<User> {
    const data = await this.authService.validateUser(email, password);

    if (typeof data === "string") {
      throw new UnauthorizedException(data);
    }

    return data;
  }
}
