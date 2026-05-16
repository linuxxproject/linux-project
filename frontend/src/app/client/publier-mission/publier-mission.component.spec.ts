import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublierMissionComponent } from './publier-mission.component';

describe('PublierMissionComponent', () => {
  let component: PublierMissionComponent;
  let fixture: ComponentFixture<PublierMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublierMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublierMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
