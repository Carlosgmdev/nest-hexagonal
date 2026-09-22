import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/shared/infrastructure/app.module.js';
import { configureApp } from '../src/shared/infrastructure/configure-app.js';

describe('Authentication (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('registers, authenticates and returns the current profile', async () => {
    const credentials = {
      name: 'Carlos',
      email: 'Carlos@Example.com',
      password: 'a-secure-password',
    };

    const registration = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    expect(registration.body).toMatchObject({
      name: 'Carlos',
      email: 'carlos@example.com',
    });
    expect(registration.body).not.toHaveProperty('password');
    expect(registration.body).not.toHaveProperty('passwordHash');

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);

    expect(login.body.access_token).toEqual(expect.any(String));

    const profile = await request(app.getHttpServer())
      .get('/auth/me')
      .auth(login.body.access_token, { type: 'bearer' })
      .expect(200);

    expect(profile.body).toEqual(registration.body);
  });

  it('rejects duplicate emails and invalid credentials', async () => {
    const user = {
      name: 'Carlos',
      email: 'carlos@example.com',
      password: 'a-secure-password',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(409);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'incorrect-password' })
      .expect(401);
  });

  it('keeps email uniqueness under concurrent registrations', async () => {
    const user = {
      name: 'Carlos',
      email: 'concurrent@example.com',
      password: 'a-secure-password',
    };

    const responses = await Promise.all([
      request(app.getHttpServer()).post('/auth/register').send(user),
      request(app.getHttpServer()).post('/auth/register').send(user),
    ]);

    expect(responses.map(({ status }) => status).sort((a, b) => a - b)).toEqual(
      [201, 409],
    );
  });

  it('protects the current profile route', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .auth('invalid-token', { type: 'bearer' })
      .expect(401);
  });

  it('validates request bodies', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'C', email: 'not-an-email', password: 'short' })
      .expect(400);
  });

  it('limits repeated login attempts', async () => {
    const attempt = () =>
      request(app.getHttpServer()).post('/auth/login').send({
        email: 'nobody@example.com',
        password: 'incorrect-password',
      });

    for (let index = 0; index < 5; index += 1) {
      await attempt().expect(401);
    }

    await attempt().expect(429);
  });
});
