// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stripe } from 'stripe';
import StripePayment from './entities/stripe.entity';
import { CreatePaymentDto } from './dto/stripe-create.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(StripePayment)
    private paymentsRepository: Repository<StripePayment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_KEY, {
      apiVersion: "2024-04-10",
    });
  }

  async createPaymentIntent(createPaymentDto: CreatePaymentDto) {
    const { amount, currency, email, firstName, lastName} = createPaymentDto;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency,
      receipt_email: email,
    });

    const payment = new StripePayment();
    payment.firstName = firstName;
    payment.lastName = lastName;
    payment.email = email;
    payment.amount = amount;
    payment.currency = currency;
    payment.paymentIntentId = paymentIntent.id;
    payment.status = paymentIntent.status;

    await this.paymentsRepository.save(payment);

    return paymentIntent;
  }
}
