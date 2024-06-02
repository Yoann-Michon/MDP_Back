// src/users/dto/update-user.dto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username?: string;
  email?: string;
  password?: string;
}
