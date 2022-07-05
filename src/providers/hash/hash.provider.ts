export abstract class HashProvider {
  abstract hash(payload: string): Promise<string>;
  abstract isPayloadComparable(payload: string, hash: string): Promise<boolean>;
}
