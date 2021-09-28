import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user-dto";

import { User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async doesUserExists(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) return true;
    else return false;
  }

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
