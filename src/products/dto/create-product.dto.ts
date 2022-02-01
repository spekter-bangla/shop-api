import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  status: boolean;

  @IsString()
  unitPrice: number;

  @IsString()
  totalStock: number;

  @IsString()
  availableStock: number;

  @IsArray()
  @IsOptional()
  images: Array<any>;

  @IsString()
  category: string;
}
