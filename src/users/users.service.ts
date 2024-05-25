import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>) {}

    async create(dto:CreateUserDto):Promise<User> {
      try {
        return await this.usersRepository.save(dto);
      } catch (error) {
        throw new ConflictException();
      }
    }
  
    async findAll():Promise<User[]>  {
      try {
        return await this.usersRepository.find();
      } catch (error) {
        throw new ConflictException();
      }
    }
  
    async findOne(id: number):Promise<User>  {
      try {
        return await this.usersRepository.findOneBy({id})
      } catch (error) {
        throw new ConflictException();
      }
    }
  
    async update(id: number, dto: CreateUserDto):Promise<User>  {
      let done = await this.usersRepository.update(id,dto);
      if (done.affected !=1)
        throw new NotFoundException(id)
      return this.findOne(id)
    }
  
    async remove(id: number):Promise<void>  {
      let done: DeleteResult = await this.usersRepository.delete(id);
      if(done.affected !=1)
        throw new NotFoundException(id)
    }

    async getUserByName(username: string): Promise<User> {
      try {
        const user = await this.usersRepository.findOneBy({ username });
        if (!user) {
          throw new NotFoundException(`User with name ${name} not found`);
        }
        return user;
      } catch (error) {
        throw new ConflictException('Failed to retrieve user by name');
      }
    }
}