import { Express } from "express";
import * as yup from "yup";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MultipleImageUploadInterceptor } from "../interceptors/MultipleImageUploadInterceptor";
import { SingleFileUploadInterceptor } from "../interceptors/SingleFileUploadInterceptor";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";
import { SubCategoriesService } from "../sub-categories/sub-categories.service";
import { Role } from "../users/user.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { parseCsv, writeCsv } from "../utils/csvOperation";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly subCategoriesService: SubCategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post("/")
  async getAllProduct(@Body() body) {
    const { category, ...filter } = body;

    const allProducts = await this.productsService.findProductByCategory(
      filter,
      category,
    );

    return {
      status: "Success",
      data: allProducts,
    };
  }

  @Get("/recentproducts")
  async getRecentProducts() {
    const recentProducts = await this.productsService.latestProduct();
    return {
      status: "Success",
      data: recentProducts,
    };
  }

  @Get("/:id")
  async getSingleProduct(@Param("id") id: string) {
    const product = await this.productsService.findSingleProduct(id);
    return {
      status: "Success",
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @UseInterceptors(MultipleImageUploadInterceptor(3 * 1024 * 1024, 3))
  @Post("/create")
  async createProduct(
    @Res() res,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files) {
      throw new BadRequestException("Please provide product image");
    }
    const isValidCategory = await this.subCategoriesService.isExists(
      createProductDto.category,
    );
    if (!isValidCategory) {
      throw new BadRequestException("Please provide a valid sub category id");
    }

    const fileUploadedResult = await this.cloudinaryService.uploadImages(
      "Product",
      files,
    );

    const imageUrls: string[] = [];
    for (let i = 0; i < fileUploadedResult.length; i++) {
      imageUrls.push(fileUploadedResult[i].url);
    }
    const product = await this.productsService.createProduct({
      ...createProductDto,
      images: imageUrls,
    });

    return res.status(HttpStatus.OK).json({
      message: "Product has been created successfully",
      product,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
  @UseInterceptors(SingleFileUploadInterceptor(["csv"], 3 * 1024 * 1024))
  @Post("/createByCsv")
  async createProductByCsv(
    @Body("categoryId") categoryId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Please provide the csv file!");
    }
    if (!categoryId) {
      throw new BadRequestException("Please provide categoryId!");
    }
    const isValidCategory = await this.subCategoriesService.isExists(
      categoryId,
    );
    if (!isValidCategory) {
      throw new BadRequestException("Please provide a valid sub category id");
    }

    const validProducts: any[] = [];
    const invalidProducts: any[] = [];

    const strTypeErr = "${path} must be a string";
    const numTypeErr = "${path} must be a number";
    const minErr = "${path} must be minimum 1 character long";
    const validationSchema = yup.object().shape({
      name: yup.string().typeError(strTypeErr).min(1, minErr).required(),
      description: yup
        .string()
        .typeError(strTypeErr)
        .min(1, minErr)
        .max(255)
        .required(),
      unitPrice: yup.number().typeError(numTypeErr).required(),
      totalStock: yup.number().typeError(numTypeErr).required(),
      availableStock: yup.number().typeError(numTypeErr).required(),
    });

    const products = await parseCsv(file.buffer);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      try {
        const validProduct: any = await validationSchema.validate(product, {
          abortEarly: false,
          stripUnknown: true,
        });
        validProduct.category = categoryId;
        validProduct.status = false;
        validProducts.push(validProduct);
      } catch (err) {
        product.error = err.errors.join(", ");
        invalidProducts.push(product);
      }
    }

    const response: any = {
      message: "",
    };
    if (validProducts.length > 0) {
      const inserted = await this.productsService.insertMany(validProducts);
      response.message = `${inserted.length} Products Created`;
    }
    if (invalidProducts.length > 0) {
      const writtenFilePath = await writeCsv(invalidProducts);
      const fileUploadedResult = await this.cloudinaryService.uploadRawFile(
        "Csv",
        writtenFilePath,
      );
      response.message =
        response.message + `, ${invalidProducts.length} Products are invalid`;
      response.data = fileUploadedResult.url;
    }

    return response;
  }
}
