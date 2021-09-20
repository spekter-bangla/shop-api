import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async insertUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const newUser = new this.userModel({
      name,
      email,
      password,
    });
    const result = await newUser.save();
    return result;
  }
}
