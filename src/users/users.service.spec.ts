import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from '../dto/sign-up.dto';
import { DomainError } from '../entities/domain-error';
import { AuthProviders, User } from '../entities/user.entity';
import { HashMemoryProvider } from '../providers/hash/hash-memory.provider';
import { HashProvider } from '../providers/hash/hash.provider';
import { UsersMemoryRepository } from './repositories/users-memory.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let database: UsersMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersMemoryRepository },
        { provide: HashProvider, useClass: HashMemoryProvider },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    database = module.get(UsersRepository);
    database.resetDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a valid user', async () => {
    const signUpData = new SignUpDto(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );

    await service.signUp(signUpData);
    const user = await database.findByEmail(signUpData.email);
    expect(user).toBeDefined();
  });

  it('should no sign up an user with duplicate email', async () => {
    const signUpData = new SignUpDto(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );
    await database.create(
      new User(
        signUpData.name,
        signUpData.email,
        signUpData.password,
        signUpData.provider,
      ),
    );

    await expect(() => service.signUp(signUpData)).rejects.toBeInstanceOf(
      DomainError,
    );
  });

  it('should return an user given a existing email & provider pair (Email provider)', async () => {
    const existingUser = new User(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );
    await database.create(existingUser);

    const user = await service.findByEmail(existingUser.email);
    expect(user.name).toEqual(existingUser.name);
    expect(user.email).toEqual(existingUser.email);
    expect(user.password).toEqual(existingUser.password);
    expect(user.provider).toEqual(existingUser.provider);
  });
});
