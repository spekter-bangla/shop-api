import { IsNumber, IsString } from "class-validator";

export class CreateOrderItemDto {
  @IsNumber()
  quantity: number;

  @IsString()
  product: string;
}
