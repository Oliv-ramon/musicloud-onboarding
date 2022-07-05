import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';
import { AuthProviders } from '../entities/user.entity';
import { HashProvider } from '../providers/hash/hash.provider';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashProvider: HashProvider,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserDto | null> {
    const { email, password, provider } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    if (provider === AuthProviders.EMAIL) {
      const isPayloadComparable = await this.hashProvider.isPayloadComparable(
        password,
        user.password,
      );

      if (isPayloadComparable) {
        delete user.password;
        return user;
      }
    }

    return null;
  }

  async login(user: UserDto) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
