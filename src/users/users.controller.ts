// src/users/users.controller.ts
import { Controller, Post, Body, Put, Param, Delete, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userDto: CreateUserDto):Promise<User> {
      return await this.usersService.create(userDto);
  }

 //@Get()
 //async findAll() {
 //    return await this.usersService.findAll();
 //}

  @Get(':id')
  async findOne(@Param('id') id: string) {
      return await this.usersService.findOne(id);
  }

  //@Patch(':id')
  //async update(@Param('id') id: string, @Body() userDto: CreateUserDto) {
 // //    return await this.usersService.update(+id, userDto);
  //}

  //@Delete(':id')
  //async remove(@Param('id') id: string) {
  //    return await this.usersService.remove(+id);
  //}
}
