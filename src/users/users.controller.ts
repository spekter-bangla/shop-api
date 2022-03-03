import { Express } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { DeleteResult } from "mongodb";

import { UsersService } from "./users.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { ResponseBody } from "../utils/ResponseBody";
import { Role, User } from "./user.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { SingleImageUploadInterceptor } from "../interceptors/SingleImageUploadInterceptor";
import { UpdateUserDto } from "./dto/update-user-dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post("/create")
  async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
    if (await this.usersService.doesUserExists(createUserDto)) {
      return res.status(HttpStatus.OK).json({
        message: "User already exists",
      });
    }

    const user = await this.usersService.insertUser(createUserDto);
    return res.status(HttpStatus.OK).json({
      message: "User has been created successfully",
      user,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @Get("/getAll")
  async getAllUser(@Query() query): Promise<ResponseBody<User[]>> {
    const { page = 1, limit = 40 } = query;

    const allUsers = await this.usersService.findAll(page, limit);

    return {
      message: "All User data",
      data: allUsers,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("/singleUser/:id")
  async getSingleUser(@Param("id") id: string) {
    console.log(id);
    const user = await this.usersService.findById(id);
    return {
      status: "Success",
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/singleUserUpdate")
  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  async updateSingleUser(
    @Req() req,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const dataToUpdate: any = {};

    if (body.name) {
      dataToUpdate.name = body.name;
    }
    if (body.email) {
      dataToUpdate.email = body.email;
    }
    if (body.phone) {
      dataToUpdate.phone = body.phone;
    }
    if (body.address) {
      dataToUpdate.address = body.address;
    }
    if (body.password) {
      dataToUpdate.password = body.password;
    }
    if (file) {
      const fileUploadedResult = await this.cloudinaryService.uploadImage(
        "User",
        file,
      );
      dataToUpdate.image = fileUploadedResult.url;
    }

    const user = await this.usersService.update(req.user, dataToUpdate);

    return {
      message: "User Updated Successfully",
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @Delete("/delete/:id")
  async deleteUser(
    @Param("id") id: string,
  ): Promise<ResponseBody<DeleteResult>> {
    const result = await this.usersService.delete(id);

    return {
      message: "User Deleted Successfully",
      data: result,
    };
  }
}
