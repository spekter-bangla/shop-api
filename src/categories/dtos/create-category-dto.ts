import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
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
}
