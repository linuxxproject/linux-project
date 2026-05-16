import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesMissionsComponent } from './mes-missions.component';

describe('MesMissionsComponent', () => {
  let component: MesMissionsComponent;
  let fixture: ComponentFixture<MesMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesMissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
