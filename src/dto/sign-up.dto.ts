import { AuthProviders } from '../entities/user.entity';

export class SignUpDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public provider: AuthProviders,
  ) {}
}
