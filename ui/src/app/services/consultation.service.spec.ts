import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConsultationService, ConsultationResponse } from './consultation.service';

describe('ConsultationService', () => {
  let service: ConsultationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConsultationService]
    });
    service = TestBed.inject(ConsultationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to start consultation', () => {
    const mockResponse: ConsultationResponse = { message: 'Success' };
    const motivoConsulta = 'Dolor rodilla';
    const edad = 50;
    const genero = 'm';

    service.startConsultation(motivoConsulta, edad, genero).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://backend-w6ii.onrender.com/start');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ 
      motivo_consulta: motivoConsulta,
      edad: edad,
      genero: genero
    });
    expect(req.request.headers.get('accept')).toBe('application/json');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    
    req.flush(mockResponse);
  });

  it('should handle error when consultation fails', () => {
    const motivoConsulta = 'Dolor rodilla';
    const edad = 50;
    const genero = 'm';
    const errorMessage = 'Internal Server Error';

    service.startConsultation(motivoConsulta, edad, genero).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('https://backend-w6ii.onrender.com/start');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});
