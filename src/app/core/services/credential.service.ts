import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateCredentialDto,
  Credential,
  CredentialCategory,
  UpdateCredentialDto,
} from '../models';

export interface CredentialFilter {
  search?: string;
  category?: CredentialCategory;
  tags?: string[];
  isExpired?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CredentialService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/credentials';

  getAll(filter?: CredentialFilter): Observable<Credential[]> {
    let params = new HttpParams();
    if (filter?.search) params = params.set('search', filter.search);
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.isExpired !== undefined) params = params.set('isExpired', String(filter.isExpired));
    if (filter?.tags?.length) params = params.set('tags', filter.tags.join(','));
    return this.http.get<Credential[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Credential> {
    return this.http.get<Credential>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateCredentialDto): Observable<Credential> {
    return this.http.post<Credential>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateCredentialDto): Observable<Credential> {
    return this.http.patch<Credential>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  export(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
