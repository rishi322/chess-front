import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTwoBoardComponent } from './player-two-board.component';

describe('PlayerTwoBoardComponent', () => {
  let component: PlayerTwoBoardComponent;
  let fixture: ComponentFixture<PlayerTwoBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTwoBoardComponent]
    });
    fixture = TestBed.createComponent(PlayerTwoBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
