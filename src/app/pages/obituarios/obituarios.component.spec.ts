import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObituariosComponent } from './obituarios.component';

describe('ObituariosComponent', () => {
  let component: ObituariosComponent;
  let fixture: ComponentFixture<ObituariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObituariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObituariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
