import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturesRecuesComponent } from './candidatures-recues.component';

describe('CandidaturesRecuesComponent', () => {
  let component: CandidaturesRecuesComponent;
  let fixture: ComponentFixture<CandidaturesRecuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidaturesRecuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturesRecuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
