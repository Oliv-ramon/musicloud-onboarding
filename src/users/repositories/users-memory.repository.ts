import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';
import { UsersRepository } from './users.repository';

export class UsersMemoryRepository implements UsersRepository {
  private users: UserDto[] = [];

  constructor() {
    this.users = [];
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async create(user: User) {
    this.users.push({ id: Date.now(), ...user });
  }

  resetDatabase() {
    this.users = [];
  }
}
