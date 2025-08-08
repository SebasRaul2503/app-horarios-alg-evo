import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private baseUrl =
    'https://api-alg-evol-flask-952185311540.us-central1.run.app/horario-optimo';

  constructor(private httpClient: HttpClient) {}

  getHorarios(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl);
  }
}
