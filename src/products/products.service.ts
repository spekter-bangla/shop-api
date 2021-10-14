import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./product.model";
import { addPagination } from "../utils/addPagination";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>,
  ) {}

  async findAllProduct(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findProductByCategory(categoryId: string, page: number, limit: number) {
    const [data] = await this.productModel.aggregate([
      { $match: { category: new Types.ObjectId(categoryId) } },
      ...addPagination(page, limit),
    ]);

    return data;
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
      rating,
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
      rating,
      images,
      category,
    });

    const productResult = await newProduct.save();
    return productResult;
  }
}
