import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalStock: number;

  @IsNumber()
  availableStock: number;

  @IsNumber()
  rating: number;

  @IsArray()
  images: Array<any>;

  @IsString()
  category: string;
}
