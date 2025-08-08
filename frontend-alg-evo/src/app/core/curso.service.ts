import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private baseUrl =
    'https://api-alg-evol-952185311540.us-central1.run.app/curso';

  constructor(private httpClient: HttpClient) {}

  getCursos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl);
  }

  addCurso(curso: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, curso);
  }
}
