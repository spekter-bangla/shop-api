import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import { Category } from "./category.model";
import { CreateCategoryDto } from "./dtos/create-category-dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>,
  ) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const { name, description, status, image } = data;

    const newCategory = new this.categoryModel({
      name,
      description,
      status,
      image,
    });

    const result = await newCategory.save();
    return result;
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id);
  }

  async findOne(criteria: FilterQuery<Category>): Promise<Category | null> {
    return this.categoryModel.findOne(criteria);
  }
}
