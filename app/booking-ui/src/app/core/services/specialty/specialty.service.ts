import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { CreateSpecialtyRequest, SpecialtyDto } from '../../models/specialty.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Specialties`;

  getAll() {
    return this.http.get<SpecialtyDto[]>(this.apiUrl);
  }

  create(name: string) {
    return this.http.post<CreateSpecialtyRequest>(this.apiUrl, { name });
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
