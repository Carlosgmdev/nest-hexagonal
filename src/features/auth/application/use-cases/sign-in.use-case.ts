import SignInRequest from "@features/auth/domain/types/sign-in-request.type";
import User from "@features/users/domain/entities/user.entity";
import UserRepository from "@features/users/domain/repositories/user.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export default class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: SignInRequest): Promise<any> {
    const user: User | null = await this.userRepository.getByUsername(data.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      username: user.username,
    }

    return {
      accessToken: await this.jwtService.signAsync(payload),
    }
  }
}