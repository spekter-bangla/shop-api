import { Express } from "express";
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
import { CategoriesService } from "../categories/categories.service";
import { SubCategoriesService } from "./sub-categories.service";
import { SubCategory } from "./sub-category.model";
import { CreateSubCategoryDto } from "./dtos/create-sub-category-dto";
import { UpdateSubCategoryDto } from "./dtos/update-sub-category-dto";
import { SingleImageUploadInterceptor } from "../interceptors/SingleImageUploadInterceptor";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../users/user.model";

@Controller("sub-categories")
export class SubCategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly subCategoriesService: SubCategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  @Post("/create")
  async createSubCategory(
    @Body() body: CreateSubCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseBody<SubCategory>> {
    if (!file) {
      throw new BadRequestException("Please provide sub-category image");
    }
    // check if already has a category with this name
    const duplicateCategoryName =
      await this.subCategoriesService.isNameAlreadyExist({
        name: body.name,
      });

    if (duplicateCategoryName) {
      throw new BadRequestException("A Category with this name already exists");
    }
    // check valid category
    const category = await this.categoriesService.findById(body.category);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }

    const fileUploadedResult = await this.cloudinaryService.uploadImage(
      "Category",
      file,
    );

    const subCategory = await this.subCategoriesService.create({
      ...body,
      image: fileUploadedResult.url,
    });

    return {
      message: "SubCategory Created Successfully",
      data: subCategory,
    };
  }

  @Get("/get/:id")
  async getSingleSubCategory(
    @Param("id") id: string,
  ): Promise<ResponseBody<SubCategory>> {
    const subCategory = await this.subCategoriesService.findById(id);

    if (!subCategory) {
      throw new NotFoundException("SubCategory Not Found");
    }

    return {
      message: "SubCategory details",
      data: subCategory,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  @Patch("/update/:id")
  async updateSubCategory(
    @Param("id") id: string,
    @Body() body: UpdateSubCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseBody<SubCategory>> {
    const dataToUpdate = { ...body };
    // check if already has a category with this name
    const duplicateCategoryName =
      await this.subCategoriesService.isNameAlreadyExist({
        id,
        name: body.name,
      });

    if (duplicateCategoryName) {
      throw new BadRequestException("A Category with this name already exists");
    }
    // check valid category
    const category = await this.categoriesService.findById(body.category);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }
    if (file) {
      const fileUploadedResult = await this.cloudinaryService.uploadImage(
        "Category",
        file,
      );

      dataToUpdate.image = fileUploadedResult.url;
    }

    const subCategory = await this.subCategoriesService.update(
      id,
      dataToUpdate,
    );

    return {
      message: "SubCategory Updated Successfully",
      data: subCategory,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @Delete("/delete/:id")
  async deleteSubCategory(
    @Param("id") id: string,
  ): Promise<ResponseBody<DeleteResult>> {
    // TODO: check product before delete
    const result = await this.subCategoriesService.delete(id);

    return {
      message: "SubCategory Deleted Successfully",
      data: result,
    };
  }
}
