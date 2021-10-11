import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status: boolean;

  @IsOptional()
  @IsString()
  image: string;
}
