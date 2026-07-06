import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketComponent } from './socket.component';

describe('SocketComponent', () => {
  let component: SocketComponent;
  let fixture: ComponentFixture<SocketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocketComponent]
    });
    fixture = TestBed.createComponent(SocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
