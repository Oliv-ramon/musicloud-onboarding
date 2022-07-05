import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { StorageProvider } from './storage.provider';

export class S3StorageProvider implements StorageProvider {
  private bucketName: string;
  private s3Client: S3Client;

  constructor() {
    this.bucketName = process.env.S3_SONG_BUCKET_NAME;
    const config = {
      region: process.env.S3_SONG_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

    this.s3Client = new S3Client(config);
  }

  getFile(filepath: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.s3Client.send(
          new GetObjectCommand({ Bucket: this.bucketName, Key: filepath }),
        );
        if (!(response.Body instanceof Readable)) {
          throw new Error(
            'something went wrong when trying to get the file from s3',
          );
        }

        const responseDataChunks: Buffer[] = [];

        response.Body.once('error', (err) => reject(err));

        response.Body.on('data', (chunk: Buffer) =>
          responseDataChunks.push(chunk),
        );

        response.Body.once('end', () =>
          resolve(Buffer.concat(responseDataChunks)),
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  async saveFile(filename: string, buffer: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: buffer,
      }),
    );
  }

  async removeFile(filename: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      }),
    );
  }
}
