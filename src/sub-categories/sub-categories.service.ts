import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { DeleteResult } from "mongodb";

import { SubCategory } from "./sub-category.model";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CategoriesService } from "../categories/categories.service";
import { CreateSubCategoryDto } from "./dtos/create-sub-category-dto";
import { UpdateSubCategoryDto } from "./dtos/update-sub-category-dto";
import { getPublicIdsFromImageUrl } from "../utils/getPublicIdsFromImageUrl";

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel("SubCategory")
    private readonly subCategoryModel: Model<SubCategory>,
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async isNameAlreadyExist(criteria: {
    id?: string;
    name: string;
  }): Promise<boolean> {
    const rootCategoryMatched = await this.categoriesService.isNameAlreadyExist(
      criteria,
    );
    if (rootCategoryMatched) {
      return true;
    }
    const { id, name } = criteria;
    let result;

    if (id) {
      result = await this.subCategoryModel.findOne({
        _id: { $nin: [id] },
        name,
      });
    } else {
      result = await this.subCategoryModel.findOne({ name });
    }

    if (result) {
      return true;
    }
    return false;
  }

  async create(data: CreateSubCategoryDto): Promise<SubCategory> {
    const { name, description, status, image, category } = data;

    const newSubCategory = new this.subCategoryModel({
      name,
      description,
      status,
      image,
      category,
    });

    const result = await newSubCategory.save();
    return result;
  }

  async findById(id: string): Promise<SubCategory | null> {
    return this.subCategoryModel.findById(id).populate("category");
  }

  async findOne(
    criteria: FilterQuery<SubCategory>,
  ): Promise<SubCategory | null> {
    return this.subCategoryModel.findOne(criteria);
  }

  async getAll(): Promise<SubCategory[]> {
    return this.subCategoryModel.find({});
  }

  async update(id: string, data: UpdateSubCategoryDto): Promise<SubCategory> {
    const subCategory = await this.findById(id);

    if (!subCategory) {
      throw new NotFoundException("Sub Category Not Found");
    }
    const previousImage = subCategory.image;

    subCategory.set(data);
    const result = await subCategory.save();

    // delete previous image
    if (data.image) {
      this.cloudinaryService.deleteImages(
        getPublicIdsFromImageUrl(previousImage),
      );
    }
    return result;
  }

  async delete(id: string): Promise<DeleteResult> {
    const subCategory = await this.findById(id);

    if (!subCategory) {
      throw new NotFoundException("Sub Category Not Found");
    }

    const result = this.subCategoryModel.deleteOne({ _id: id });

    // remove image from cloudinary
    this.cloudinaryService.deleteImages(
      getPublicIdsFromImageUrl(subCategory.image),
    );

    return result;
  }
}
