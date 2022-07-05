import { Injectable } from '@nestjs/common';
import { FileDto } from '../dto/file.dto';
import { DomainError } from '../entities/domain-error';
import { Song } from '../entities/song.entity';
import { StorageProvider } from '../providers/storage/storage.provider';
import { SongsRepository } from './repositories/songs.repository';

@Injectable()
export class SongsService {
  constructor(
    private readonly songsRepository: SongsRepository,
    private readonly storageProvider: StorageProvider,
  ) {}

  async upload(userId: number, songFile: FileDto) {
    const { filename, mimetype, buffer } = songFile;
    const songTitle = filename.split('.').at(0);
    const song = new Song(songTitle);

    const isAudioFile = mimetype.includes('audio');
    if (!isAudioFile) {
      throw new DomainError(
        Song.name,
        'only audio files are valid',
        'invalid operation',
      );
    }

    const songId = await this.songsRepository.create(song, userId);
    const songFileName = `${songId}-${filename}`;
    await this.storageProvider.saveFile(songFileName, buffer);

    return {
      id: songId,
      title: song.title,
      songFileName,
    };
  }
}
