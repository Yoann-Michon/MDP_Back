import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @Column()
  locationImg: string;

  @Column()
  stock: number
}