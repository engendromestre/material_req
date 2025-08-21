import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.item.map((item) => item.product_id);
    const uniqueProductIds = [...new Set(productIds)];
    const products = await this.productRepo.findBy({
      id: In(uniqueProductIds),
    });

    if (products.length !== uniqueProductIds.length) {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Algum produto não existe. Produtos passados: ${productIds.join(', ')}, produtos encontrados: ${products.map((p) => p.id).join(', ')}`,
      );
    }

    const order = Order.create({
      client_id: 1,
      items: createOrderDto.item.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const product = products.find((p) => p.id === item.product_id);
        if (!product) {
          throw new Error(`Produto com ID ${item.product_id} não encontrado`);
        }

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          price: product.price,
        };
      }),
    });
    await this.orderRepo.save(order);
    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }
}
