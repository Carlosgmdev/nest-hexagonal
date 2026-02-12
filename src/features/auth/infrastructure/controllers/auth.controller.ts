import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import AuthService from '../../application/auth.service';
import SignInDto from '../dtos/sign-in.dto';
import { AuthGuard } from '../guards/auth.guard';
import { SignInResponse } from '@features/auth/domain/types/sign-in-response.type';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    return await this.authenticationService.signIn(signInDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(): string {
    return 'Profile';
  }
}
