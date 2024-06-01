import { IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @Min(0)
  amount: number;
  @IsString()
  @IsNotEmpty()
  currency: string;
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
