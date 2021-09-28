import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../users/user.model";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
