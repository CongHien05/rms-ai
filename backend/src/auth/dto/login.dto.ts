import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, registerDecorator } from 'class-validator';
import { normalizeEmail, passwordLengthAllowed } from '../password.js';

function LoginPassword(): PropertyDecorator {
  return (target, propertyKey) => registerDecorator({
    name: 'loginPassword',
    target: target.constructor,
    propertyName: String(propertyKey),
    options: { message: 'Độ dài mật khẩu không hợp lệ.' },
    validator: { validate: (value) => typeof value === 'string' && passwordLengthAllowed(value) },
  });
}

export class LoginDto {
  @Transform(({ value }) => typeof value === 'string' ? normalizeEmail(value) : value)
  @IsEmail()
  @Matches(/^[\x21-\x7e]+$/)
  @MaxLength(254)
  email: string;

  @IsString()
  @LoginPassword()
  password: string;
}
