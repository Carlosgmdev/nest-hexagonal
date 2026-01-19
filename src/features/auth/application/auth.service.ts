import { Injectable } from '@nestjs/common';
import UserRepository from '@features/users/domain/repositories/user.repository';
import SignInRequest from '../domain/types/sign-in-request.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInRequest): Promise<any> {
    const payload = {
      sub: 1,
      username: 'example',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
