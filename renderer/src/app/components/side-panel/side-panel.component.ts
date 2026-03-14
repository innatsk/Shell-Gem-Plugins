import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PluginService, PluginInfo, PluginParam } from '../../services/plugin.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent],
  template: `
    <div class="overlay" *ngIf="isOpen" (click)="close()"></div>
    <div class="panel" [class.open]="isOpen">
      <div class="panel-header" *ngIf="plugin">
        <div class="header-left">
          <img *ngIf="plugin.iconPath" [src]="plugin.iconPath" alt="icon" onerror="this.src='./favicon.ico'" class="plugin-icon"/>
          <div *ngIf="!plugin.iconPath" class="placeholder-icon"></div>
          <h2>{{ plugin.name }}</h2>
        </div>
        <button class="btn-close" (click)="close()">✕</button>
      </div>
      
      <div class="panel-body">
        <!-- Loading State -->
        <div class="state-container loading-state" *ngIf="loadingParams">
            <div class="skeleton-shimmer"></div>
            <div class="skeleton-shimmer"></div>
            <div class="skeleton-shimmer short"></div>
        </div>

        <!-- Error State -->
        <div class="state-container error-state" *ngIf="fetchError">
            <span class="error-icon">⚠️</span>
            <p>{{ fetchError }}</p>
            <button class="btn-outline" (click)="loadSchema()">Retry</button>
        </div>

        <!-- Form Area -->
        <div class="form-area" *ngIf="!loadingParams && !fetchError && schema.length > 0">
           <app-dynamic-form [schema]="schema" [form]="form"></app-dynamic-form>
        </div>
        
        <div class="form-area" *ngIf="!loadingParams && !fetchError && schema.length === 0">
           <p class="text-muted">No configurable parameters for this plugin.</p>
        </div>
      </div>
      
      <div class="panel-footer" *ngIf="!loadingParams && !fetchError">
         <div class="inline-error" *ngIf="applyError">{{ applyError }}</div>
         <div class="inline-success" *ngIf="applySuccess">✓ Applied</div>
         
         <button class="btn-apply" 
                 [disabled]="form.invalid || applying || schema.length === 0" 
                 (click)="onApply()">
             {{ applying ? 'Applying...' : 'Apply' }}
         </button>
      </div>
    </div>
  `,
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnChanges {
  @Input() plugin: PluginInfo | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  schema: PluginParam[] = [];
  form: FormGroup = new FormGroup({});
  
  loadingParams = false;
  fetchError = '';
  applyError = '';
  applySuccess = false;
  applying = false;

  constructor(private pluginService: PluginService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['plugin'] && this.plugin && this.isOpen) {
       this.resetState();
       this.loadSchema();
    }
  }

  close() {
    this.resetState();
    this.closed.emit();
  }

  resetState() {
    this.schema = [];
    this.form = new FormGroup({});
    this.fetchError = '';
    this.applyError = '';
    this.applySuccess = false;
    this.loadingParams = false;
    this.applying = false;
  }

  async loadSchema() {
    if (!this.plugin) return;
    this.loadingParams = true;
    this.fetchError = '';
    
    try {
      const resp = await this.pluginService.getParams(this.plugin.id);
      if (resp.success) {
        this.schema = resp.params;
        this.buildForm();
      } else {
        this.fetchError = resp.error || 'Plugin is not responding';
      }
    } catch (e: any) {
      this.fetchError = e.message || 'Failed to fetch parameters';
    } finally {
      this.loadingParams = false;
    }
  }

  buildForm() {
    const group: any = {};
    for (const p of this.schema) {
       const validators = [];
       if (p.required) validators.push(Validators.required);
       if (p.type === 'number' && p.min !== undefined) validators.push(Validators.min(p.min));
       if (p.type === 'number' && p.max !== undefined) validators.push(Validators.max(p.max));
       
       let initialValue = p.defaultValue ?? '';
       if (p.type === 'boolean') initialValue = p.defaultValue ?? false;
       
       group[p.key] = new FormControl(initialValue, validators);
    }
    this.form = new FormGroup(group);
  }

  async onApply() {
    if (this.form.invalid || !this.plugin) return;
    this.applying = true;
    this.applyError = '';
    this.applySuccess = false;

    try {
       const resp = await this.pluginService.updateParams(this.plugin.id, this.form.value);
       if (resp.success) {
           this.applySuccess = true;
           setTimeout(() => this.applySuccess = false, 2000);
       } else {
           this.applyError = resp.error || 'Failed to apply parameters';
       }
    } catch (e: any) {
       this.applyError = e.message || 'DLL method threw an exception';
    } finally {
       this.applying = false;
    }
  }
}
