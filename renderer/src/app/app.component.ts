import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginGridComponent } from './components/plugin-grid/plugin-grid.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { PluginInfo } from './services/plugin.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PluginGridComponent, SidePanelComponent],
  template: `
    <app-plugin-grid (onPluginClick)="openPanel($event)"></app-plugin-grid>
    <app-side-panel [plugin]="selectedPlugin" [isOpen]="isPanelOpen" (closed)="onPanelClosed()"></app-side-panel>
  `
})
export class AppComponent {
  selectedPlugin: PluginInfo | null = null;
  isPanelOpen = false;

  openPanel(plugin: PluginInfo) {
    this.selectedPlugin = plugin;
    this.isPanelOpen = true;
  }

  onPanelClosed() {
    this.isPanelOpen = false;
    // We intentionally don't clear selectedPlugin instantly so exit animation works smoothly without breaking the DOM.
    setTimeout(() => this.selectedPlugin = null, 300);
  }
}
