import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatImgPopupComponent } from './chat-img-popup.component';

describe('ChatImgPopupComponent', () => {
  let component: ChatImgPopupComponent;
  let fixture: ComponentFixture<ChatImgPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatImgPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatImgPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
