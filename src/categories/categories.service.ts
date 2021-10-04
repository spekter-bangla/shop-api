import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DeleteResult } from "mongodb";

import { Category } from "./category.model";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateCategoryDto } from "./dtos/create-category-dto";
import { UpdateCategoryDto } from "./dtos/update-category-dto";
import { getPublicIdsFromImageUrl } from "../utils/getPublicIdsFromImageUrl";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>,
    private readonly cloudinaryService: CloudinaryService,
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

  async getAll(): Promise<Category[]> {
    return this.categoryModel.find({});
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }
    const previousImage = category.image;

    category.set(data);
    const result = await category.save();

    // delete previous image
    if (data.image) {
      this.cloudinaryService.deleteImages(
        getPublicIdsFromImageUrl(previousImage),
      );
    }
    return result;
  }

  async delete(id: string): Promise<DeleteResult> {
    // TODO: check product, sub category before delete

    return this.categoryModel.deleteOne({ _id: id });
  }
}
