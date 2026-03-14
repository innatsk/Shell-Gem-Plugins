import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PluginParam } from '../../../services/plugin.service';

@Component({
  selector: 'app-text-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="control-container">
      <label [for]="param.key">{{ param.label }} <span *ngIf="param.required" class="req">*</span></label>
      <input type="text" [id]="param.key" [formControl]="control" [placeholder]="param.placeholder || ''" />
      <div class="error-msg" *ngIf="control.invalid && control.touched">
        Invalid required field
      </div>
    </div>
  `
})
export class TextControlComponent {
  @Input() param!: PluginParam;
  @Input() control!: FormControl;
}
