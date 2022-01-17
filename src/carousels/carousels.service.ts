import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeleteResult } from "mongodb";

import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { CreateCarouselDto } from "./dto/create-carousel.dto";
import { Carousel } from "./carousel.model";
import { getPublicIdsFromImageUrl } from "../utils/getPublicIdsFromImageUrl";

@Injectable()
export class CarouselService {
  constructor(
    @InjectModel("Carousel") private readonly carouselModel: Model<Carousel>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllCarousel(): Promise<Carousel[]> {
    return this.carouselModel.find({});
  }

  async findSingleCarousel(id: string): Promise<Carousel> {
    const carousel = await this.carouselModel.findById(id);

    if (!carousel) {
      throw new NotFoundException(`Carousel not found`);
    }

    return carousel;
  }

  async createCarousel(
    createCarouselDto: CreateCarouselDto,
  ): Promise<Carousel> {
    const { image, url } = createCarouselDto;

    const newCarousel = new this.carouselModel({
      image,
      url,
    });

    return newCarousel.save();
  }

  async updateCarousel(
    carouselId: string,
    dataToUpdate: CreateCarouselDto,
  ): Promise<Carousel> {
    const carousel = await this.findSingleCarousel(carouselId);

    if (!carousel) {
      throw new NotFoundException("Carousel Not Found");
    }
    const previousImage = carousel.image;

    carousel.set(dataToUpdate);
    const result = await carousel.save();

    // delete previous image
    if (dataToUpdate.image) {
      this.cloudinaryService.deleteImages(
        getPublicIdsFromImageUrl(previousImage),
      );
    }
    return result;
  }

  async removeCarousel(carouselId: string): Promise<DeleteResult> {
    const carousel = await this.findSingleCarousel(carouselId);

    if (!carousel) {
      throw new NotFoundException("Carousel Not Found");
    }

    const result = await this.carouselModel.deleteOne({ _id: carouselId });

    // remove image from cloudinary
    this.cloudinaryService.deleteImages(
      getPublicIdsFromImageUrl(carousel.image),
    );

    return result;
  }
}
