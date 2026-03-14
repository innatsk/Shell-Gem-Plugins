import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PluginParam } from '../../../services/plugin.service';

@Component({
  selector: 'app-number-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="control-container">
      <label [for]="param.key">{{ param.label }} <span *ngIf="param.required" class="req">*</span></label>
      <input type="number" [id]="param.key" [formControl]="control" 
             [min]="param.min ?? ''" [max]="param.max ?? ''" [step]="param.step ?? '1'" />
      <div class="error-msg" *ngIf="control.invalid && control.touched">
        Must be between {{ param.min }} and {{ param.max }}
      </div>
    </div>
  `
})
export class NumberControlComponent {
  @Input() param!: PluginParam;
  @Input() control!: FormControl;
}
