import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export type CreateOrderCommand = {
  client_id: number;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
};

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
  client_id: number; // usuário autenticado
  @Column()
  status: OrderStatus = OrderStatus.PENDING;
  @CreateDateColumn()
  created_at: Date = new Date();
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  //Trabalhar de forma mais anêmica ou rica
  // rica: jogar as regras de negócio que não dependem de banco de dados
  // para dentro da própria entidade
  // dessa forma podemos salvar a ordem e os itens de uma vez
  static create(input: CreateOrderCommand) {
    const order = new Order();
    order.client_id = input.client_id;
    order.items = input.items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.product_id = item.product_id;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      return orderItem;
    });
    order.total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return order;
  }
}
