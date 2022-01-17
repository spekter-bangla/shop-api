import { IsOptional, IsString } from "class-validator";

export class CreateCarouselDto {
  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  url: string;
}
