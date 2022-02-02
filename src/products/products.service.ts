import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./product.model";
import { addPagination } from "../utils/addPagination";
import { CategoriesService } from "../categories/categories.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAllProduct(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findProductByCategory(categoryId: string, page: number, limit: number) {
    let catIds = [new Types.ObjectId(categoryId)];
    const categoryDoc: any = await this.categoriesService.findById(categoryId);

    if (categoryDoc) {
      catIds = categoryDoc.subCategories.reduce((acc, { _id }) => {
        acc.push(new Types.ObjectId(_id));
        return acc;
      }, []);
    }

    const [data] = await this.productModel.aggregate([
      { $match: { category: { $in: catIds } } },
      ...addPagination(page, limit),
    ]);

    return data;
  }

  async latestProduct(): Promise<Product[]> {
    return this.productModel.find({}).sort({ createdAt: -1 }).limit(10);
  }

  async findSingleProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate("category");
    if (!product) {
      throw new NotFoundException(`Product with this id:  ${id} not found`);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      description,
      status,
      unitPrice,
      totalStock,
      availableStock,
      images,
      category,
    } = createProductDto;

    const newProduct = new this.productModel({
      name,
      description,
      status,
      unitPrice,
      totalStock,
      availableStock,
      images,
      category,
    });

    const productResult = await newProduct.save();
    return productResult;
  }

  async insertMany(products): Promise<Product[]> {
    return this.productModel.insertMany(products);
  }

  async isProductExists(productId: string): Promise<boolean> {
    return this.productModel.exists({ _id: productId });
  }

  async updateProductRating(productId: string, rating: number): Promise<void> {
    await this.productModel.findByIdAndUpdate(productId, { rating });
  }
}
