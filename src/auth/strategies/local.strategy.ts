import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user: User = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
