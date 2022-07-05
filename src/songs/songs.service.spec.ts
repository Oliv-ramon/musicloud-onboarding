import { Test, TestingModule } from '@nestjs/testing';
import { FileDto } from '../dto/file.dto';
import { DomainError } from '../entities/domain-error';
import { FsStorageProvider } from '../providers/storage/fs-storage.provider';
import { StorageProvider } from '../providers/storage/storage.provider';
import { SongsMemoryRepository } from './repositories/songs-memory.repository';
import { SongsRepository } from './repositories/songs.repository';
import { SongsService } from './songs.service';

describe('SongsService', () => {
  let service: SongsService;
  let database: SongsMemoryRepository;
  let storage: FsStorageProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        { provide: SongsRepository, useClass: SongsMemoryRepository },
        { provide: StorageProvider, useClass: FsStorageProvider },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    database = module.get(SongsRepository);
    storage = module.get(StorageProvider);
    database.resetDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a valid song', async () => {
    const userId = 1;
    const filename = 'mysong.mp3';
    const mimetype = 'audio/mpeg';
    const bytes = [1, 2, 3];
    const buffer = Buffer.from(bytes);

    const fileDto = new FileDto(filename, mimetype, buffer);
    const uploadResponse = await service.upload(userId, fileDto);
    const songFile = await storage.getFile(
      storage.getFilePath(uploadResponse.songFileName),
    );

    expect(uploadResponse.title.includes('.mp3')).toBeFalsy();
    expect(songFile.byteLength).toEqual(bytes.length);
  });

  it('should not create an invalid song', async () => {
    const userId = 1;
    const filename = 'myimage.jpeg';
    const mimetype = 'image/jpeg';
    const bytes = [1, 2, 3];
    const buffer = Buffer.from(bytes);

    const fileDto = new FileDto(filename, mimetype, buffer);
    await expect(() => service.upload(userId, fileDto)).rejects.toBeInstanceOf(
      DomainError,
    );
  });

  afterAll(async () => {
    await storage.resetStorage();
  });
});
