import * as bcrypt from 'bcrypt';
import { HashProvider } from './hash.provider';

export class BcryptHashProvider implements HashProvider {
  hash(payload: string) {
    return bcrypt.hash(payload, 12);
  }

  isPayloadComparable(payload: string, hash: string) {
    return bcrypt.compare(payload, hash);
  }
}
