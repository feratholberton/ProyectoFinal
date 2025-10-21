import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ConsultationRequest {
  motivo_consulta: string;
  edad: number;
  genero: string;
}

export interface Opcion {
  label: string;
  checked: boolean;
}

export interface ConsultationResponse {
  patientID: string;
  pasoActual: string;
  opciones: Opcion[];
}

export interface CollectRequest {
  patientID: string;
  opciones: string[];
  additional: string;
}

export interface CollectResponse {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://backend-w6ii.onrender.com';

  startConsultation(motivoConsulta: string, edad: number, genero: string): Observable<ConsultationResponse> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body: ConsultationRequest = {
      motivo_consulta: motivoConsulta,
      edad: edad,
      genero: genero
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

  collectData(patientID: string, selectedOptions: string[], additional: string = ''): Observable<CollectResponse> {
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body: CollectRequest = {
      patientID: patientID,
      opciones: selectedOptions,
      additional: additional
    };

    return this.http.post<CollectResponse>(
      `${this.apiUrl}/api/collect`,
      body,
      { headers }
    ).pipe(
      catchError(err => {
        console.error('Failed to collect data', err);
        return throwError(() => err);
      })
    );
  }
}
