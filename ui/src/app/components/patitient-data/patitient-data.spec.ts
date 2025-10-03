import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatitientData } from './patitient-data';

describe('PatitientData', () => {
  let component: PatitientData;
  let fixture: ComponentFixture<PatitientData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatitientData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatitientData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
