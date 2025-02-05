import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

export class Encryptor<T> {
  private readonly key: Buffer; // AES-256 key (32 bytes)
  private readonly ivLength: number = 16; // AES block size (16 bytes)

  constructor(secretKey: string) {
    if (secretKey.length !== 32) {
      throw new Error('Secret key must be 32 characters long for AES-256.');
    }
    this.key = Buffer.from(secretKey);
  }

  /**
   * Encrypts data of any type.
   * @param data - The data to encrypt
   * @returns The encrypted text in base64 format
   */
  encrypt(data: T): string {
    const iv = randomBytes(this.ivLength); // Generate random IV
    const cipher = createCipheriv('aes-256-cbc', this.key, iv);

    // Serialize the data to a JSON string
    const plainText = JSON.stringify(data);

    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return `${iv.toString('base64')}:${encrypted}`; // Return IV:EncryptedData
  }

  /**
   * Decrypts an encrypted string and returns the data as its original type.
   * @param encryptedText - The encrypted text in base64 format
   * @returns The decrypted data in its original type
   */
  decrypt(encryptedText: string): T {
    // Split the IV and encrypted data
    const [iv, encryptedData] = encryptedText.split(':').map((part) => Buffer.from(part, 'base64'));

    const decipher = createDecipheriv('aes-256-cbc', this.key, iv);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typesafeencrypteddata = encryptedData as any;

    // Decrypt the data
    let decrypted = decipher.update(typesafeencrypteddata, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // Deserialize the JSON string back into the original type
    return JSON.parse(decrypted) as T;
  }
}
