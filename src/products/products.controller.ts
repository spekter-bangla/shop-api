import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("/")
  async getAllProduct() {
    const productAll = await this.productsService.findAllProduct();
    return {
      status: "Success",
      data: productAll,
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

  @Post("/create")
  async createProductDto(
    @Res() res,
    @Body() createProductDto: CreateProductDto,
  ) {
    // console.log(createProductDto);
    const product = await this.productsService.createProduct(createProductDto);

    return res.status(HttpStatus.OK).json({
      message: "Product has been created successfully",
      product,
    });
  }
}
