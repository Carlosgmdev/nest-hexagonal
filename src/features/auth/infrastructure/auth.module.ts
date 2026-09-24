import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import AuthService from '../application/auth.service.js';
import type AccessTokenIssuer from '../application/ports/access-token-issuer.port.js';
import type AccessTokenVerifier from '../application/ports/access-token-verifier.port.js';
import type IdGenerator from '../application/ports/id-generator.port.js';
import type PasswordHasher from '../application/ports/password-hasher.port.js';
import type UserRepository from '../../users/application/ports/user-repository.port.js';
import UsersModule from '../../users/infrastructure/users.module.js';
import { USER_REPOSITORY } from '../../users/infrastructure/users.tokens.js';
import Argon2PasswordHasher from './adapters/argon2-password-hasher.adapter.js';
import JwtAccessTokenAdapter from './adapters/jwt-access-token.adapter.js';
import UuidGenerator from './adapters/uuid-generator.adapter.js';
import AuthController from './http/auth.controller.js';
import AuthGuard from './http/auth.guard.js';

import {
  ACCESS_TOKEN_ISSUER,
  ACCESS_TOKEN_ADAPTER,
  ACCESS_TOKEN_VERIFIER,
  ID_GENERATOR,
  PASSWORD_HASHER,
} from './auth.tokens.js';

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
      provide: ACCESS_TOKEN_ADAPTER,
      inject: [JwtService],
      useFactory: (jwtService: JwtService): JwtAccessTokenAdapter =>
        new JwtAccessTokenAdapter(jwtService),
    },
    { provide: ACCESS_TOKEN_ISSUER, useExisting: ACCESS_TOKEN_ADAPTER },
    { provide: ACCESS_TOKEN_VERIFIER, useExisting: ACCESS_TOKEN_ADAPTER },
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
