import { generateRandomWord } from "./generateRandomWords";
import * as Forge from 'node-forge';
import * as CryptoJS from 'crypto-js';

export function cifrateData<T>(publicKey: string, body: T): string{
  const publickey = Forge.pki.publicKeyFromPem(publicKey);
  const randomkey = generateRandomWord();
  const encryptedData = publickey.encrypt(randomkey,'RSA-OAEP')
  const rsaData = Forge.util.encode64(encryptedData)
  const bodyString = JSON.stringify(body);
  const cipher = CryptoJS.AES.encrypt(bodyString, CryptoJS.enc.Utf8.parse(randomkey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    keySize: 256
  });
  return `${rsaData}.${cipher.toString()}`
}
