import { DomainError } from './domain-error';
import { Song } from './song.entity';

describe('Song', () => {
  it('should create a song successfully', () => {
    const title = 'my song';
    const artist = 'my artist';
    const album = 'my album';
    const year = 2022;
    const song = new Song(title, artist, album, year);

    expect(song).toBeDefined();
  });

  it('should throw an error when trying to create a Song without title', () => {
    const emptyTitle = '';
    expect(() => new Song(emptyTitle)).toThrowError(DomainError);
  });
});
