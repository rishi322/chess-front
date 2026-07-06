import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybtnComponent } from './playbtn.component';

describe('PlaybtnComponent', () => {
  let component: PlaybtnComponent;
  let fixture: ComponentFixture<PlaybtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaybtnComponent]
    });
    fixture = TestBed.createComponent(PlaybtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
