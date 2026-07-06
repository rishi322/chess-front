import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScomponentComponent } from './scomponent.component';

describe('ScomponentComponent', () => {
  let component: ScomponentComponent;
  let fixture: ComponentFixture<ScomponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScomponentComponent]
    });
    fixture = TestBed.createComponent(ScomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
