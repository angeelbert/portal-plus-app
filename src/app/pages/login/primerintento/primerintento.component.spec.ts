import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimerintentoComponent } from './primerintento.component';

describe('PrimerintentoComponent', () => {
  let component: PrimerintentoComponent;
  let fixture: ComponentFixture<PrimerintentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimerintentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrimerintentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
