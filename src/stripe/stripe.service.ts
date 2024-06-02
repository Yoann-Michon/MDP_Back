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
    try {
      const { amount, currency, email, firstName, lastName } = createPaymentDto;
  
      // Validation des données
      if (!amount || !currency || !email || !firstName || !lastName) {
        throw new Error("Toutes les informations requises ne sont pas fournies.");
      }
  
      // Création du paiement avec Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency,
        receipt_email: email,
      });
  
      // Enregistrement du paiement dans la base de données
      const payment = new StripePayment();
      payment.firstName = firstName;
      payment.lastName = lastName;
      payment.email = email;
      payment.amount = amount;
      payment.currency = currency;
      payment.paymentIntentId = paymentIntent.id;
      payment.status = paymentIntent.status;
  
      await this.paymentsRepository.save(payment);
  
      // Renvoi des données du paiement
      return {
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
      };
    } catch (error) {
      // Gestion des erreurs
      console.error("Erreur lors de la création du paiement :", error.message);
      throw new Error("Une erreur est survenue lors du traitement du paiement.");
    }
  }
  
  

  async getAllProductStripe(){
    try {
      const products = await this.stripe.products.list({
        limit: 20,
      });
      return products;
    } catch (error) {
      
    }
  }
}
