import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class RegisterUserDto {
  @IsString()
  @Length(2, 100)
  declare name: string;

  @IsEmail()
  @MaxLength(254)
  declare email: string;

  @IsString()
  @MinLength(15)
  @MaxLength(128)
  declare password: string;
}
