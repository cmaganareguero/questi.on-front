import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsroomComponent } from './statsroom.component';

describe('StatsroomComponent', () => {
  let component: StatsroomComponent;
  let fixture: ComponentFixture<StatsroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsroomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
