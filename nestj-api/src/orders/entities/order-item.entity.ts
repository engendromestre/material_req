import { Product } from '@/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Order)
  order: Order;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' }) // define o nome da chave estrangeira o typeorm cria por padrão no estilo CammelCase productId
  product: Product;
  product_id: string;
  @Column({ type: 'int' })
  quantity: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
