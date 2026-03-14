import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginIconComponent } from './plugin-icon.component';

describe('PluginIconComponent', () => {
  let component: PluginIconComponent;
  let fixture: ComponentFixture<PluginIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PluginIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PluginIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
