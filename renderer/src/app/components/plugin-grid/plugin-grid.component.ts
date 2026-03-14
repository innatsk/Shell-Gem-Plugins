import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginService, PluginInfo } from '../../services/plugin.service';
import { PluginIconComponent } from '../plugin-icon/plugin-icon.component';

@Component({
  selector: 'app-plugin-grid',
  standalone: true,
  imports: [CommonModule, PluginIconComponent],
  template: `
    <div class="grid-container">
      <app-plugin-icon *ngFor="let plugin of plugins" 
                       [plugin]="plugin" 
                       (onClick)="onPluginClick.emit(plugin)">
      </app-plugin-icon>

      <div class="loading-state" *ngIf="loading">
         Loading...
      </div>
      <div class="error-state" *ngIf="error">
         {{ error }}
      </div>
      <div class="empty-state" *ngIf="!loading && !error && plugins.length === 0">
         No plugins found in plugins/dlls/
      </div>
    </div>
  `,
  styleUrls: ['./plugin-grid.component.scss']
})
export class PluginGridComponent implements OnInit {
  plugins: PluginInfo[] = [];
  loading = true;
  error?: string;

  @Output() onPluginClick = new EventEmitter<PluginInfo>();

  constructor(private pluginService: PluginService) {}

  async ngOnInit() {
    try {
      const response = await this.pluginService.listPlugins();
      if (response.success) {
        this.plugins = response.plugins;
      } else {
        this.error = response.error;
      }
    } catch (e: any) {
      this.error = e.message || 'Error communicating with main process';
    } finally {
      this.loading = false;
    }
  }
}
