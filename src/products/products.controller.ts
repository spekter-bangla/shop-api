import { Express, query } from "express";
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
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MultipleImageUploadInterceptor } from "../interceptors/MultipleImageUploadInterceptor";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("/")
  async getAllProduct() {
    const productAll = await this.productsService.findAllProduct();
    return {
      status: "Success",
      data: productAll,
    };
  }

  @Get("/findBycategory")
  async findByFilter(@Query("category") category) {
    const data = await this.productsService.findProductBycaregory(category);
    // console.log(data);
  }

  @Get("/:id")
  async getSingleProduct(@Param("id") id: string) {
    const product = await this.productsService.findSingleProduct(id);
    return {
      status: "Success",
      data: product,
    };
  }

  @UseInterceptors(MultipleImageUploadInterceptor(3 * 1024 * 1024, 3))
  @Post("/create")
  async createProductDto(
    @Res() res,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // console.log(createProductDto);

    if (!files) {
      throw new BadRequestException("Please provide category image");
    }

    const fileUploadedResult = await this.cloudinaryService.uploadImages(
      "Category",
      files,
    );

    console.log(fileUploadedResult);

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
}
