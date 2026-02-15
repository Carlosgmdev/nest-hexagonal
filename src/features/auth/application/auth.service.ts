import { Injectable, UnauthorizedException } from "@nestjs/common";
import UserRepository from "@features/users/domain/repositories/user.repository";
import SignInRequest from "../domain/types/sign-in-request.type";
import { JwtService } from "@nestjs/jwt";
import User from "@features/users/domain/entities/user.entity";
import { SignInResponse } from "../domain/types/sign-in-response.type";
import HashingService from "@shared/domain/ports/hashing.service";
import { JWTPayload } from "../domain/types/jwt-payload.type";

@Injectable()
export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(data: SignInRequest): Promise<SignInResponse> {
    const user: User | null = await this.userRepository.getByUsername(
      data.username,
    );

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid: boolean = await this.hashingService.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    const payload: JWTPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken: string = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
