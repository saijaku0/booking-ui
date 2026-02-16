import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  CreateSpecialtyRequest,
  SpecialtyDto,
  UpdateSpecialtyRequest,
} from '@core/models/specialty.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Specialties`;

  getAll() {
    return this.http.get<SpecialtyDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<SpecialtyDto> {
    return this.http.get<SpecialtyDto>(`${this.apiUrl}/${id}`);
  }

  create(name: string) {
    return this.http.post<CreateSpecialtyRequest>(this.apiUrl, { name });
  }

  update(id: string, name: string): Observable<void> {
    const request: UpdateSpecialtyRequest = { id, name };
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
