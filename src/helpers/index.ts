import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const SECRET: string = process.env.SECRET || ''; // Retrieve the value of the SECRET environment variable from process.env

/**
 * Generate an authentication hash based on salt and password
 * @param salt - The salt value
 * @param password - The password value
 * @returns The authentication hash as a string
 */
export function authentication(salt: string, password: string): string {
  // Create an HMAC object using sha256 algorithm, combining salt and password as the key
  // Update the HMAC with the SECRET value and generate the hash in hexadecimal format
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

/**
 * Generate a random value
 * @returns The generated random value as a string
 */
export function random(): string {
  // Generate random bytes and convert them to a base64 encoded string
  return crypto.randomBytes(128).toString('base64');
}
