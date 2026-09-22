import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import AuthService from '../application/auth.service.js';
import type AccessTokenIssuer from '../application/ports/access-token-issuer.js';
import type AccessTokenVerifier from '../application/ports/access-token-verifier.js';
import type IdGenerator from '../application/ports/id-generator.js';
import type PasswordHasher from '../application/ports/password-hasher.js';
import type UserRepository from '../../users/application/ports/user.repository.js';
import UsersModule from '../../users/infrastructure/users.module.js';
import { USER_REPOSITORY } from '../../users/infrastructure/users.tokens.js';
import Argon2PasswordHasher from './argon2-password-hasher.js';
import AuthController from './auth.controller.js';
import AuthGuard from './auth.guard.js';

import {
  ACCESS_TOKEN_ISSUER,
  ACCESS_TOKEN_SERVICE,
  ACCESS_TOKEN_VERIFIER,
  ID_GENERATOR,
  PASSWORD_HASHER,
} from './auth.tokens.js';

import JwtAccessTokenService from './jwt-access-token.service.js';
import UuidGenerator from './uuid-generator.js';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');

        return {
          secret: secret ?? 'local-development-secret-change-before-production',
          signOptions: {
            expiresIn: 15 * 60,
            issuer: 'nest-hexagonal',
            audience: 'nest-hexagonal-api',
          },
          verifyOptions: {
            issuer: 'nest-hexagonal',
            audience: 'nest-hexagonal-api',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
    { provide: ID_GENERATOR, useClass: UuidGenerator },
    {
      provide: ACCESS_TOKEN_SERVICE,
      inject: [JwtService],
      useFactory: (jwtService: JwtService): JwtAccessTokenService =>
        new JwtAccessTokenService(jwtService),
    },
    { provide: ACCESS_TOKEN_ISSUER, useExisting: ACCESS_TOKEN_SERVICE },
    { provide: ACCESS_TOKEN_VERIFIER, useExisting: ACCESS_TOKEN_SERVICE },
    {
      provide: AuthGuard,
      inject: [ACCESS_TOKEN_VERIFIER, Reflector],
      useFactory: (
        verifier: AccessTokenVerifier,
        reflector: Reflector,
      ): AuthGuard => new AuthGuard(verifier, reflector),
    },
    { provide: APP_GUARD, useExisting: AuthGuard },
    {
      provide: AuthService,
      inject: [
        USER_REPOSITORY,
        PASSWORD_HASHER,
        ACCESS_TOKEN_ISSUER,
        ID_GENERATOR,
      ],
      useFactory: (
        users: UserRepository,
        passwordHasher: PasswordHasher,
        accessTokenIssuer: AccessTokenIssuer,
        idGenerator: IdGenerator,
      ): AuthService =>
        new AuthService(users, passwordHasher, accessTokenIssuer, idGenerator),
    },
  ],
})
export default class AuthModule {}
