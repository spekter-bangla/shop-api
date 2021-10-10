import { IsNumber, IsString } from "class-validator";

export class createOrderItemDto {
  @IsNumber()
  quantity: number;

  @IsString()
  product: string;
}
