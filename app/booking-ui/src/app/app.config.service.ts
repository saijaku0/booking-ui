import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private http = inject(HttpClient);

  getDoctors() {
    return this.http.get(`${environment.apiUrl}/Doctors`);
  }
}
