import { HashProvider } from './hash.provider';

export class HashMemoryProvider implements HashProvider {
  async hash(payload: string) {
    return payload;
  }

  async isPayloadComparable(payload: string, hash: string) {
    return payload === hash;
  }
}
