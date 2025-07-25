import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { IUser } from '../users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user = await this.usersService.findUser(username);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const passwordIsMatch = await argon2.verify(user.password, password);
    if (!passwordIsMatch) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }

  async login(user: IUser) {
    const { uuid, username } = user;

    try {
      const token = await this.jwtService.signAsync({
        sub: uuid,
        username,
      });

      return {
        message: 'Вход успешен',
        uuid,
        username,
        token,
      };
    } catch (error) {
      console.error('Ошибка при генерации токена:', error);
      throw new InternalServerErrorException('Ошибка при входе в систему');
    }
  }
}
