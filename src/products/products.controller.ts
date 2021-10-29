import { Express } from "express";
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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { MultipleImageUploadInterceptor } from "../interceptors/MultipleImageUploadInterceptor";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../users/user.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("/")
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async getAllProduct(@Query() query) {
    const { category, page = 1, limit = 40 } = query;

    if (!category) {
      throw new BadRequestException("Please Provide a Category Id");
    }

    const allProducts = await this.productsService.findProductByCategory(
      category,
      page,
      limit,
    );

    return {
      status: "Success",
      data: allProducts,
    };
  }

  @Get("/recentproducts")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
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

  @UseInterceptors(MultipleImageUploadInterceptor(3 * 1024 * 1024, 3))
  @Post("/create")
  async createProductDto(
    @Res() res,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files) {
      throw new BadRequestException("Please provide category image");
    }

    const fileUploadedResult = await this.cloudinaryService.uploadImages(
      "Category",
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
}
