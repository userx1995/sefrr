import { TestBed } from '@angular/core/testing';

import { SchoolAdminGuard } from './school-admin.guard';

describe('SchoolAdminGuard', () => {
  let guard: SchoolAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SchoolAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
