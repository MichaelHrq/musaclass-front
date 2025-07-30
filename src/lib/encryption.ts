import { env } from '@/constants/env';
import CryptoJS from 'crypto-js';

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, env.crypto!).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, env.crypto!);
  return bytes.toString(CryptoJS.enc.Utf8);
}