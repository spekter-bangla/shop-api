import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateRatingDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rate: number;
}
