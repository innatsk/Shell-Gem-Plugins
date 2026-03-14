import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginGridComponent } from './plugin-grid.component';

describe('PluginGridComponent', () => {
  let component: PluginGridComponent;
  let fixture: ComponentFixture<PluginGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PluginGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PluginGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
