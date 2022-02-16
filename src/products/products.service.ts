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

  async findProductByCategory(filter: any, categoryId?: string) {
    const { page = 1, limit = 40, sort = ["new"] } = filter;
    let productFilter: any[] = [];
    let sortFilter: any = {};

    for (let i = 0; i < sort.length; i++) {
      const sortCond = sort[i];
      if (sortCond === "new") {
        sortFilter.createdAt = -1;
      } else if (sortCond === "old") {
        sortFilter.createdAt = 1;
      } else if (sortCond === "rating_high") {
        sortFilter.rating = -1;
      } else if (sortCond === "rating_low") {
        sortFilter.rating = 1;
      } else if (sortCond === "price_high") {
        sortFilter.unitPrice = -1;
      } else if (sortCond === "price_low") {
        sortFilter.unitPrice = 1;
      }
    }

    if (categoryId) {
      let catIds = [new Types.ObjectId(categoryId)];
      const categoryDoc: any = await this.categoriesService.findById(
        categoryId,
      );

      if (categoryDoc) {
        catIds = categoryDoc.subCategories.reduce((acc, { _id }) => {
          acc.push(new Types.ObjectId(_id));
          return acc;
        }, []);
      }

      productFilter.push({ $match: { category: { $in: catIds } } });
    }

    const [data] = await this.productModel.aggregate([
      ...productFilter,
      { $sort: sortFilter },
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

  async getProductAvailableStock(
    productIds: string[],
  ): Promise<{ _id: any; availableStock: number }[]> {
    return this.productModel
      .find({ _id: { $in: productIds } })
      .select("availableStock");
  }

  async updateProductStock(data: { product: string; quantity: number }[]) {
    const queryPromise: any = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const query = this.productModel.findByIdAndUpdate(item.product, {
        $inc: { availableStock: Number(`-${item.quantity}`) },
      });
      queryPromise.push(query);
    }

    await Promise.all(queryPromise);
  }
}
