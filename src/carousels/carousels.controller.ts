import { Express } from "express";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { SingleImageUploadInterceptor } from "../interceptors/SingleImageUploadInterceptor";
import { CreateCarouselDto } from "./dto/create-carousel.dto";
import { CarouselService } from "./carousels.service";
import { Role } from "../users/user.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ResponseBody } from "../utils/ResponseBody";
import { Carousel } from "./carousel.model";

@Controller("carousels")
@UseGuards(JwtAuthGuard, RolesGuard(Role.ADMIN))
export class CarouselController {
  constructor(
    private readonly carouselService: CarouselService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("/")
  async getAllCarousel(): Promise<ResponseBody<Carousel[]>> {
    const allCarousels = await this.carouselService.findAllCarousel();

    return {
      data: allCarousels,
    };
  }

  @Get("/:id")
  async getSingleCarousel(@Param("id") id: string) {
    const carousel = await this.carouselService.findSingleCarousel(id);

    return carousel;
  }

  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  @Post("/create")
  async create(
    @Body() body: CreateCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Please provide carousel image");
    }

    const fileUploadedResult = await this.cloudinaryService.uploadImage(
      "Carousel",
      file,
    );
    const carousel = await this.carouselService.createCarousel({
      ...body,
      image: fileUploadedResult.url,
    });

    return carousel;
  }

  @UseInterceptors(SingleImageUploadInterceptor(3 * 1024 * 1024))
  @Patch("/update/:id")
  async updateCarousel(
    @Param("id") id: string,
    @Body() body: CreateCarouselDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseBody<Carousel>> {
    const dataToUpdate = { ...body };
    if (file) {
      const fileUploadedResult = await this.cloudinaryService.uploadImage(
        "Carousel",
        file,
      );

      dataToUpdate.image = fileUploadedResult.url;
    }

    const carousel = await this.carouselService.updateCarousel(
      id,
      dataToUpdate,
    );

    return {
      message: "Carousel Updated Successfully",
      data: carousel,
    };
  }

  @Delete("/delete/:id")
  async deleteCarousel(@Param("id") id: string) {
    const result = await this.carouselService.removeCarousel(id);

    return {
      message: "Carousel Deleted Successfully",
      data: result,
    };
  }
}
