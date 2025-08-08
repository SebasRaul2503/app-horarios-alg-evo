import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaboratoriosService {
  private baseUrl =
    'https://api-alg-evol-952185311540.us-central1.run.app/laboratorio';
  constructor(private httpClient: HttpClient) {}

  getLaboratorios(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl);
  }

  addLaboratorio(laboratorio: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, laboratorio);
  }
}
