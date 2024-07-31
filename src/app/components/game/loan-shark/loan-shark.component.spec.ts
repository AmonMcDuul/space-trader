import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSharkComponent } from './loan-shark.component';

describe('LoanSharkComponent', () => {
  let component: LoanSharkComponent;
  let fixture: ComponentFixture<LoanSharkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSharkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoanSharkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
