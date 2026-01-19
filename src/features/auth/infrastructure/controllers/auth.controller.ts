import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import AuthService from '../../application/auth.service';
import SignInDto from '../dtos/sign-in.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    return await this.authenticationService.signIn(signInDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(): string {
    return 'Profile';
  }
}
