import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { UpdateResult, DeleteResult } from "mongodb";

import { CreateUserDto } from "./dto/create-user-dto";
import { User } from "./user.model";
import { addPagination } from "../utils/addPagination";

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

  async findAll(page: number, limit: number) {
    const [data] = await this.userModel.aggregate([
      { $match: { role: "user" } },
      { $project: { password: 0 } },
      ...addPagination(page, limit),
    ]);

    return data;
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

  async delete(id: string): Promise<DeleteResult> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    return this.userModel.deleteOne({ _id: id });
  }
}
