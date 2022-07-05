import { Module } from '@nestjs/common';
import { FsStorageProvider } from 'src/providers/storage/fs-storage.provider';
import { PrismaConnection } from '../infra/database/prisma-connection';
import { S3StorageProvider } from '../providers/storage/s3-storage.provider';
import { StorageProvider } from '../providers/storage/storage.provider';
import { SongsDatabaseRepository } from './repositories/songs-database.repository';
import { SongsRepository } from './repositories/songs.repository';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  controllers: [SongsController],
  providers: [
    SongsService,
    PrismaConnection,
    { provide: SongsRepository, useClass: SongsDatabaseRepository },
    { provide: StorageProvider, useClass: FsStorageProvider },
  ],
  exports: [SongsService],
})
export class SongsModule {}
