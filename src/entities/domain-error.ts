export class DomainError {
  constructor(
    public entityName: string,
    public message: string,
    public type: DomainErrorType = 'invalid operation',
  ) {}

  getFullMessage() {
    return `${this.entityName}: ${this.message}`;
  }
}

export type DomainErrorType =
  | 'unauthorized'
  | 'invalid entity'
  | 'invalid operation'
  | 'entity not found';
