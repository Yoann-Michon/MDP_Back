import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import StripePayment from './entities/stripe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StripePayment])],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
