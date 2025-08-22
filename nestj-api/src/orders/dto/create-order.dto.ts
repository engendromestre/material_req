import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  card_hash: string;
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36) // uuid tem 36 caracteres
  product_id: string;
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
