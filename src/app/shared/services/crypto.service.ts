import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secretKey: string = environment.secretKeyRT;

  encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.secretKey).toString();
  }

  decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
