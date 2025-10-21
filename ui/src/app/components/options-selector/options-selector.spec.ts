import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsSelector } from './options-selector';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OptionsSelector', () => {
  let component: OptionsSelector;
  let fixture: ComponentFixture<OptionsSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsSelector, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
