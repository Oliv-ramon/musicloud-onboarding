import { Module } from '@nestjs/common';
import { PrismaConnection } from '../infra/database/prisma-connection';
import { BcryptHashProvider } from '../providers/hash/bcrypt-hash.provider';
import { HashProvider } from '../providers/hash/hash.provider';
import { UsersDatabaseRepository } from './repositories/users-database.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaConnection,
    { provide: UsersRepository, useClass: UsersDatabaseRepository },
    { provide: HashProvider, useClass: BcryptHashProvider },
  ],
  exports: [UsersService],
})
export class UsersModule {}
