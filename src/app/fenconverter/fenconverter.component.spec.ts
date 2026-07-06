import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FenconverterComponent } from './fenconverter.component';

describe('FenconverterComponent', () => {
  let component: FenconverterComponent;
  let fixture: ComponentFixture<FenconverterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FenconverterComponent]
    });
    fixture = TestBed.createComponent(FenconverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
