import { SongDto } from '../../dto/song.dto';
import { Song } from '../../entities/song.entity';

export abstract class SongsRepository {
  abstract create(song: Song, userId: number): Promise<number>;
  abstract findById(songId: number): Promise<SongDto>;
}
