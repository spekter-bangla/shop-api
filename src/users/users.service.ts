import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { UpdateResult } from "mongodb";

import { CreateUserDto } from "./dto/create-user-dto";
import { User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async doesUserExists(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) return true;
    else return false;
  }

  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, phone, password } = createUserDto;
    const newUser = new this.userModel({
      name,
      email,
      phone,
      password,
    });
    const result = await newUser.save();
    return result;
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findOne(criteria: FilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(criteria);
  }

  async updateOne(
    criteria: FilterQuery<User>,
    updateData: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userModel.updateOne(criteria, updateData);
  }
}
