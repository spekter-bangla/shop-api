import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { DeleteResult } from "mongodb";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

import { ResponseBody } from "../utils/ResponseBody";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.model";
import { CreateCategoryDto } from "./dtos/create-category-dto";
import { UpdateCategoryDto } from "./dtos/update-category-dto";
import { SingleImageUploadInterceptor } from "../interceptors/SingleImageUploadInterceptor";

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  @Post("/create")
  async createCategory(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseBody<Category>> {
    if (!file) {
      throw new BadRequestException("Please provide category image");
    }
    // check if already has a category with this name
    const duplicateCategoryName =
      await this.categoriesService.isNameAlreadyExist({
        name: body.name,
      });

    if (duplicateCategoryName) {
      throw new BadRequestException("A Category with this name already exists");
    }
    const fileUploadedResult = await this.cloudinaryService.uploadImage(
      "Category",
      file,
    );

    const category = await this.categoriesService.create({
      ...body,
      image: fileUploadedResult.url,
    });

    return {
      message: "Category Created Successfully",
      data: category,
    };
  }

  @Get("/getAll")
  async getAllCategories(): Promise<ResponseBody<Category[]>> {
    const allCategories = await this.categoriesService.getAll();

    return {
      message: "All categories",
      data: allCategories,
    };
  }

  @Get("/get/:id")
  async getSingleCategory(
    @Param("id") id: string,
  ): Promise<ResponseBody<Category>> {
    const category = await this.categoriesService.findById(id);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }

    return {
      message: "Category details",
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  @Patch("/update/:id")
  async updateCategory(
    @Param("id") id: string,
    @Body() body: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseBody<Category>> {
    const dataToUpdate = { ...body };
    // check if already has a category with this name
    const duplicateCategoryName =
      await this.categoriesService.isNameAlreadyExist({
        id,
        name: body.name,
      });

    if (duplicateCategoryName) {
      throw new BadRequestException("A Category with this name already exists");
    }
    if (file) {
      const fileUploadedResult = await this.cloudinaryService.uploadImage(
        "Category",
        file,
      );

      dataToUpdate.image = fileUploadedResult.url;
    }

    const category = await this.categoriesService.update(id, dataToUpdate);

    return {
      message: "Category Updated Successfully",
      data: category,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  async deleteCategory(
    @Param("id") id: string,
  ): Promise<ResponseBody<DeleteResult>> {
    // TODO: check product, sub category before delete
    const result = await this.categoriesService.delete(id);

    return {
      message: "Category Deleted Successfully",
      data: result,
    };
  }
}
