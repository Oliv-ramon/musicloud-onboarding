import { DomainError } from './domain-error';

export class Song {
  constructor(
    public title: string,
    public artist: string | null = null,
    public album: string | null = null,
    public year: number | null = null,
  ) {
    if (!this.title || typeof this.title !== 'string') {
      throw new DomainError(
        Song.name,
        'title is required and must be a string',
        'invalid entity',
      );
    }
  }
}
