import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user-dto";

import { User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, phone, address, password } = createUserDto;
    const newUser = new this.userModel({
      name,
      email,
      phone,
      address,
      password,
    });
    const result = await newUser.save();
    return result;
  }
}
