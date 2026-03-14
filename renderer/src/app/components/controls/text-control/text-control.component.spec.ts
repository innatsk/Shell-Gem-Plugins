import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextControlComponent } from './text-control.component';

describe('TextControlComponent', () => {
  let component: TextControlComponent;
  let fixture: ComponentFixture<TextControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
