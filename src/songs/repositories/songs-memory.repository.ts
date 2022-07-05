import { SongDto } from '../../dto/song.dto';
import { Song } from '../../entities/song.entity';
import { SongsRepository } from './songs.repository';

export class SongsMemoryRepository implements SongsRepository {
  private songs: SongDto[] = [];

  constructor() {
    this.songs = [];
  }

  async findById(songId: number): Promise<SongDto> {
    return this.songs.find((song) => song.id === songId);
  }

  async create(song: Song, userId: number) {
    const id = Date.now();

    this.songs.push({ id, userId, ...song });

    return id;
  }

  resetDatabase() {
    this.songs = [];
  }
}
