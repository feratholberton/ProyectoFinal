import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ConsultationRequest {
  motivo_consulta: string;
}

export interface ConsultationResponse {
  // Define the response structure based on what your API returns
  // For example:
  // id?: string;
  // message?: string;
  // Add other fields as needed
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://backend-w6ii.onrender.com';

  startConsultation(motivoConsulta: string): Observable<ConsultationResponse> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body: ConsultationRequest = {
      motivo_consulta: motivoConsulta
    };

    return this.http.post<ConsultationResponse>(
      `${this.apiUrl}/start`,
      body,
      { headers }
    ).pipe(
      catchError(err => {
        console.error('Failed to start consultation', err);
        return throwError(() => err);
      })
    );
  }
}
