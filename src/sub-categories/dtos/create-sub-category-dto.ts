import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: boolean;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
