import { Injectable } from '@nestjs/common';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';
import { PrismaConnection } from '../../infra/database/prisma-connection';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersDatabaseRepository implements UsersRepository {
  constructor(private readonly connection: PrismaConnection) {}

  async findByEmail(email: string): Promise<UserDto | null> {
    const data = await this.connection.user.findUnique({
      where: {
        email,
      },
    });

    if (!data) return null;

    return new UserDto(
      data.id,
      data.name,
      data.email,
      data.password,
      data.provider,
    );
  }

  async create(user: User) {
    await this.connection.user.create({
      data: user,
    });
  }
}
