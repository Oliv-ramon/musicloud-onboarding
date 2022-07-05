export class FileDto {
  constructor(
    public filename: string,
    public mimetype: string,
    public buffer: Buffer,
  ) {}
}
