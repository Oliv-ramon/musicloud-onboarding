import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { LoginDto } from '../src/dto/login.dto';
import { SignUpDto } from '../src/dto/sign-up.dto';
import { AuthProviders, User } from '../src/entities/user.entity';
import { PrismaConnection } from '../src/infra/database/prisma-connection';
import { DomainExceptionFilter } from '../src/infra/http/domain-exception.filter';
import { SongsModule } from '../src/songs/songs.module';
import { UsersRepository } from '../src/users/repositories/users.repository';
import { UsersModule } from '../src/users/users.module';

describe('E2E tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule, SongsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();

    const prismaConnection = app.get<PrismaConnection>(PrismaConnection);
    await prismaConnection.song.deleteMany({});
    await prismaConnection.user.deleteMany({});
  });

  it('should sign up given valid credentials', async () => {
    const usersRepository = app.get<UsersRepository>(UsersRepository);
    const signUpData = new SignUpDto(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(signUpData);
    const createdUser = await usersRepository.findByEmail(signUpData.email);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(createdUser).not.toEqual(null);
  });

  it('should login and successfully use token given valid credentials', async () => {
    const password = '12345678';
    const user = new User(
      'Fulano',
      'fulano@email.com',
      bcrypt.hashSync(password, 12),
      AuthProviders.EMAIL,
    );
    const usersRepository = app.get<UsersRepository>(UsersRepository);
    await usersRepository.create(user);

    const loginDto = new LoginDto(user.email, password, user.provider);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(loginResponse.status).toEqual(HttpStatus.CREATED);

    const token = loginResponse.body.access_token;
    const profileResponse = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toEqual(HttpStatus.OK);
    expect(profileResponse.body.email).toEqual(user.email);
  });

  afterAll(async () => {
    await app.close();
  });
});
