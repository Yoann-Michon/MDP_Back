import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class StripePayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column() 
  email: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentIntentId: string;

  @Column({ default: 'pending' })
  status: string;
}
