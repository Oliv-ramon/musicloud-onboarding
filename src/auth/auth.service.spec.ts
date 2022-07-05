import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { DomainError } from '../entities/domain-error';
import { AuthProviders, User } from '../entities/user.entity';
import { HashMemoryProvider } from '../providers/hash/hash-memory.provider';
import { HashProvider } from '../providers/hash/hash.provider';
import { UsersMemoryRepository } from '../users/repositories/users-memory.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('UsersService', () => {
  let service: AuthService;
  let database: UsersMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        { provide: HashProvider, useClass: HashMemoryProvider },
        { provide: UsersRepository, useClass: UsersMemoryRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    database = module.get(UsersRepository);
    database.resetDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login given valid credentials', async () => {
    const existingUser = new User(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );
    await database.create(existingUser);

    const loginDto = new LoginDto(
      existingUser.email,
      existingUser.password,
      existingUser.provider,
    );
    const user = await service.validateUser(loginDto);
    const { access_token } = await service.login(user);

    expect(access_token).toBeDefined();
  });

  it('should not login given invalid credentials', () => {
    expect(() => new LoginDto('', '', AuthProviders.EMAIL)).toThrowError(
      DomainError,
    );
  });

  it('should not login given invalid credentials', async () => {
    const loginDto = new LoginDto(
      'invalid@email.com',
      'invalid',
      AuthProviders.EMAIL,
    );
    const user = await service.validateUser(loginDto);

    expect(user).toBeNull();
  });

  it('should not login given invalid provider', async () => {
    const existingUser = new User(
      'Fulano',
      'fulano@email.com',
      '',
      AuthProviders.GITHUB,
    );
    await database.create(existingUser);
    const loginDto = new LoginDto(
      existingUser.email,
      existingUser.password,
      existingUser.provider,
    );

    const user = await service.validateUser(loginDto);
    expect(user).toBeNull();
  });
});
