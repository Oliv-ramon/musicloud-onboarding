import { DomainError } from './domain-error';
import { AuthProviders, User } from './user.entity';

describe('User', () => {
  it('should create an User provided by email successfully', () => {
    const name = 'Fulano';
    const email = 'fulano@email.com';
    const password = '12345678';
    const provider: AuthProviders = AuthProviders.EMAIL;
    const user = new User(name, email, password, provider);

    expect(user).toBeDefined();
  });

  it('should throw an error when trying to create an User without name', () => {
    const emptyName = '';
    const provider: AuthProviders = AuthProviders.EMAIL;
    expect(() => new User(emptyName, '', '', provider)).toThrowError(
      DomainError,
    );
  });

  it('should throw an error when trying to create an User without email', () => {
    const name = 'Fulano';
    const emptyEmail = '';
    const provider: AuthProviders = AuthProviders.EMAIL;
    expect(() => new User(name, emptyEmail, '', provider)).toThrowError(
      DomainError,
    );
  });

  it('should throw an error when trying to create an User provided by email without password', () => {
    const name = 'Fulano';
    const email = 'fulano@email.com';
    const emptyPassword = '';
    const provider: AuthProviders = AuthProviders.EMAIL;
    expect(() => new User(name, email, emptyPassword, provider)).toThrowError(
      DomainError,
    );
  });

  it('should throw an error when trying to create an User provided by email with a short password', () => {
    const name = 'Fulano';
    const email = 'fulano@email.com';
    const shortPassword = '1234567';
    const provider: AuthProviders = AuthProviders.EMAIL;
    expect(() => new User(name, email, shortPassword, provider)).toThrowError(
      DomainError,
    );
  });
});
