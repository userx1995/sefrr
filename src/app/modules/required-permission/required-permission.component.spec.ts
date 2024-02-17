import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredPermissionComponent } from './required-permission.component';

describe('RequiredPermissionComponent', () => {
  let component: RequiredPermissionComponent;
  let fixture: ComponentFixture<RequiredPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequiredPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
