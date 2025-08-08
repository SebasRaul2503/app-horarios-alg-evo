import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  private baseUrl =
    'https://api-alg-evol-952185311540.us-central1.run.app/profesor';
  constructor(private httpClient: HttpClient) {}

  getDocentes(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl);
  }

  addDocente(docente: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, {
      nombre: docente.nombre,
      disponibilidad: docente.disponibilidad,
    });
  }
}
