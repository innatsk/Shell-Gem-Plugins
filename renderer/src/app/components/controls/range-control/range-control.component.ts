import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PluginParam } from '../../../services/plugin.service';

@Component({
  selector: 'app-range-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="control-container">
      <label [for]="param.key">{{ param.label }}</label>
      <div class="range-wrapper">
        <span class="range-min">{{ param.min }}</span>
        <input type="range" [id]="param.key" [formControl]="control" 
               [min]="param.min" [max]="param.max" [step]="param.step || '1'" />
        <span class="range-max">{{ param.max }}</span>
        <span class="range-value">{{ control.value }}</span>
      </div>
    </div>
  `
})
export class RangeControlComponent {
  @Input() param!: PluginParam;
  @Input() control!: FormControl;
}
