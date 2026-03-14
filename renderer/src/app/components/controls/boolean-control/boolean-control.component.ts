import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PluginParam } from '../../../services/plugin.service';

@Component({
  selector: 'app-boolean-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="control-container row-flex">
      <label [for]="param.key">{{ param.label }}</label>
      <label class="switch">
        <input type="checkbox" [id]="param.key" [formControl]="control" />
        <span class="slider round"></span>
      </label>
    </div>
  `
})
export class BooleanControlComponent {
  @Input() param!: PluginParam;
  @Input() control!: FormControl;
}
