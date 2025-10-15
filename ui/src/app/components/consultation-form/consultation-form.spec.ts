import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationForm } from './consultation-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConsultationForm', () => {
  let component: ConsultationForm;
  let fixture: ComponentFixture<ConsultationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationForm, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
