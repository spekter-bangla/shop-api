import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { DeleteResult } from "mongodb";

import { Category } from "./category.model";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateCategoryDto } from "./dtos/create-category-dto";
import { UpdateCategoryDto } from "./dtos/update-category-dto";
import { getPublicIdsFromImageUrl } from "../utils/getPublicIdsFromImageUrl";
import { AllCustomErrors } from "../utils/product.custom-errors";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async isNameAlreadyExist(criteria: {
    id?: string;
    name: string;
  }): Promise<boolean> {
    const { id, name } = criteria;
    let result;

    if (id) {
      result = await this.categoryModel.findOne({
        _id: { $nin: [id] },
        name,
      });
    } else {
      result = await this.categoryModel.findOne({ name });
    }

    if (result) {
      return true;
    }
    return false;
  }

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
    const isvalidId = Types.ObjectId.isValid(id);
    if (!isvalidId) {
      throw new NotFoundException(AllCustomErrors.invalidObjectIdError);
    }

    const [result] = await this.categoryModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "subcategories",
          let: {
            thisDocKey: `$_id`,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [`$category`, "$$thisDocKey"],
                },
              },
            },
          ],
          as: "subCategories",
        },
      },
    ]);

    return result;
  }

  async findOne(criteria: FilterQuery<Category>): Promise<Category | null> {
    return this.categoryModel.findOne(criteria);
  }

  async getAll(): Promise<Category[]> {
    const result = await this.categoryModel.aggregate([
      {
        $lookup: {
          from: "subcategories",
          let: {
            thisDocKey: `$_id`,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [`$category`, "$$thisDocKey"],
                },
              },
            },
          ],
          as: "subCategories",
        },
      },
    ]);
    return result;
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
    const isvalidId = Types.ObjectId.isValid(id);
    if (!isvalidId) {
      throw new NotFoundException(AllCustomErrors.invalidObjectIdError);
    }
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException("Category Not Found");
    }

    const result = this.categoryModel.deleteOne({ _id: id });

    // remove image from cloudinary
    this.cloudinaryService.deleteImages(
      getPublicIdsFromImageUrl(category.image),
    );

    return result;
  }
}
