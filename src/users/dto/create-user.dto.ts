// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../auth/guards/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  @IsString()
  emai: string

  @IsEnum(Role)
  role: Role;
}
