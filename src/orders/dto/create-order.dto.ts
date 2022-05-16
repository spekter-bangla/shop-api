import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

class OrderItem {
  @IsNumber()
  quantity: number;

  @IsString()
  product: string;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => OrderItem)
  orderItems: OrderItem[];
}
