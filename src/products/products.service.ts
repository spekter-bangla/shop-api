import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "./product.model";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>,
  ) {}

  async findAllProduct(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findSingleProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
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
