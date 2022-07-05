import { AuthProviders, User } from '@prisma/client';

export class UserDto implements User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public provider: AuthProviders,
  ) {}
}
