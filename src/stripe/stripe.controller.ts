import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentDto } from './dto/stripe-create.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('donation')
  async createDonation(@Body() formData: any) {
    // Extraction des données du formulaire
    let amount = parseFloat(formData.amount);
    const currency = formData.currency;
    const email = formData.email;
    const firstName = formData.firstName;
    const lastName = formData.lastName;

    // Vérification que tous les champs requis sont présents
    if (!amount || !currency || !email || !firstName || !lastName) {
      throw new BadRequestException('Données du formulaire manquantes');
    }

    // Si amount est un entier, on le convertit en flottant avec deux décimales
    if (Number.isInteger(amount)) {
      amount = parseFloat(amount.toFixed(2));
    }

    const createPaymentDto: CreatePaymentDto = {
      amount,
      currency,
      email,
      firstName,
      lastName,
    };

    const paymentIntent = await this.stripeService.createPaymentIntent(createPaymentDto);
    console.log(paymentIntent);
    return { clientSecret: paymentIntent.client_secret };
  }
}
