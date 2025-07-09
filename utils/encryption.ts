import { AES, lib, enc } from 'crypto-js';

const encryptSecretKey = (randomString: string, encryptionKey: string) => {
  return AES.encrypt(randomString, encryptionKey).toString();
};

const decryptSecretKey = (encryptedString: string, encryptionKey: string) => {
  return AES.decrypt(encryptedString, encryptionKey).toString(enc.Utf8);
};

const generateRandomString = (length: number) => {
  const randomBytes = lib.WordArray.random(length);
  const secretKey = randomBytes.toString(enc.Hex);

  return secretKey;
};

export { encryptSecretKey, decryptSecretKey, generateRandomString };
