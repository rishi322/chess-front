import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { PawnComponent } from './pawn.component';

describe('PawnComponent', () => {
  let component: PawnComponent;
  let fixture: ComponentFixture<PawnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PawnComponent]
    });
    fixture = TestBed.createComponent(PawnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
