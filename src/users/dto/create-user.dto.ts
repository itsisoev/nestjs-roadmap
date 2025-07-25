import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  username: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(3, { message: 'Пароль должен содержать минимум 3 символа' })
  password: string;
}
