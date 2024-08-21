import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Countries } from '../interfaces/countries';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  readonly http = inject(HttpClient);
  readonly apiUrl = environment.api;
  readonly authUrl = environment.auth;
  readonly fileUrl = environment.file;
  readonly publicKey = environment.pathCert;

  getCountries(): Observable<Countries[]> {
    return this.http.get<Countries[]>('/data/countries.json');
  }
}
