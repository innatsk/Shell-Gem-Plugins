import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PluginInfo } from '../../services/plugin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plugin-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plugin-card" (click)="onClick.emit(plugin)">
      <div class="icon-container">
        <!-- If no icon, show default square, else show img -->
        <img *ngIf="plugin.iconPath" [src]="plugin.iconPath" alt="icon" onerror="this.src='./favicon.ico'" />
        <div *ngIf="!plugin.iconPath" class="placeholder-icon"></div>
      </div>
      <div class="plugin-name" [title]="plugin.name">{{plugin.name}}</div>
      
      <!-- Status dot -->
      <div class="status-dot" 
           [class.green]="plugin.status === 'active'"
           [class.red]="plugin.status === 'error'"
           [class.gray]="plugin.status === 'pending'"
           [title]="plugin.error || plugin.status">
      </div>
    </div>
  `,
  styleUrls: ['./plugin-icon.component.scss']
})
export class PluginIconComponent {
  @Input() plugin!: PluginInfo;
  @Output() onClick = new EventEmitter<PluginInfo>();
}
