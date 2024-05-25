import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UnauthorizedException } from '@nestjs/common'
import { Injectable } from "@nestjs/common/decorators";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super();
    }

    async validate(username: string, password: string): Promise<User> {
        const user: User = await this.userService.getUserByName(username);
        if (username == user.username && user.password === password) {
            return user;
        }
        else {
            throw new UnauthorizedException();
        }
    }
}