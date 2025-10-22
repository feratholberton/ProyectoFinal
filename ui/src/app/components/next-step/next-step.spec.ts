import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NextStep } from './next-step';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NextStep', () => {
  let component: NextStep;
  let fixture: ComponentFixture<NextStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextStep, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
