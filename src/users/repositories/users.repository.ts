import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<UserDto | null>;
  abstract create(user: User): Promise<void>;
}
