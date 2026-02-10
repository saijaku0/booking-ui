import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DoctorLayout } from './doctor-layout';
import { Component } from '@angular/core';

@Component({ standalone: true, template: '' })
class DummyLoginComponent {}

describe('DoctorLayout', () => {
  let component: DoctorLayout;
  let fixture: ComponentFixture<DoctorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorLayout],
      providers: [provideRouter([{ path: 'auth/login', component: DummyLoginComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
