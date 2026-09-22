import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import AuthService from '../application/auth.service.js';
import type { UserProfile } from '../application/auth.service.js';
import AuthExceptionFilter from './auth-exception.filter.js';
import type { AuthenticatedUser } from './authenticated-user.js';
import { CurrentUser } from './current-user.decorator.js';
import LoginDto from './dto/login.dto.js';
import RegisterUserDto from './dto/register-user.dto.js';
import { Public } from './public.decorator.js';

@Controller('auth')
@UseFilters(AuthExceptionFilter)
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60 * 60 * 1_000 } })
  register(@Body() command: RegisterUserDto): Promise<UserProfile> {
    return this.authService.register(command);
  }

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  login(@Body() command: LoginDto) {
    return this.authService.login(command);
  }

  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser): Promise<UserProfile> {
    return this.authService.getProfile(user.id);
  }
}
