import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { OrderStatus } from "../oder.model";

class OrderItem {
  @IsNumber()
  quantity: number;

  @IsString()
  product: string;
}

export class CreateOrderDto {
  @IsString()
  user: string;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => OrderItem)
  orderItems: OrderItem[];

  @IsString()
  status: OrderStatus;
}
