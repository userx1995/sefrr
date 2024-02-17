import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvetationLinkComponent } from './invetation-link.component';

describe('InvetationLinkComponent', () => {
  let component: InvetationLinkComponent;
  let fixture: ComponentFixture<InvetationLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvetationLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvetationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
