import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateRatingDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
