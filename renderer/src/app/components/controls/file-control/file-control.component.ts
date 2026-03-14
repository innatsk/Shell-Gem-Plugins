import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PluginParam } from '../../../services/plugin.service';
import { FileService } from '../../../services/file.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="control-container">
      <label>{{ param.label }} <span *ngIf="param.required" class="req">*</span></label>
      <div class="file-row">
        <button type="button" class="btn-browse" (click)="fileInput.click()">Browse...</button>
        <span class="file-name" [title]="selectedFileName || 'No file chosen'">
          {{ selectedFileName || 'No file chosen' }}
        </span>
      </div>
      <div class="file-hint" *ngIf="param.accept">Accepts: {{ param.accept }}</div>
      
      <input type="file" #fileInput [id]="param.key" [accept]="param.accept || '*'" 
             (change)="onFileSelected($event)" style="display: none;" />
             
      <div class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</div>
      <div class="error-msg" *ngIf="control.invalid && control.touched && !errorMsg">
        File is required
      </div>
    </div>
  `
})
export class FileControlComponent implements OnInit, OnDestroy {
  @Input() param!: PluginParam;
  @Input() control!: FormControl;
  
  selectedFileName = '';
  errorMsg = '';
  private sub!: Subscription;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    // If form control is reset from outside (e.g. side panel closed)
    this.sub = this.control.valueChanges.subscribe(val => {
      if (!val) {
        this.selectedFileName = '';
        this.errorMsg = '';
      }
    });
  }

  ngOnDestroy() {
     if (this.sub) this.sub.unsubscribe();
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.errorMsg = '';
    
    if (!file) {
      this.selectedFileName = '';
      this.control.setValue('');
      return;
    }

    const maxSize = (this.param.maxSizeKb || 10240) * 1024; // default 10MB
    if (file.size > maxSize) {
      this.errorMsg = `File too large. Max size is ${this.param.maxSizeKb || 10240}KB.`;
      this.selectedFileName = file.name;
      this.control.setErrors({ size: true });
      this.control.markAsTouched();
      return;
    }

    this.selectedFileName = file.name;
    try {
      const base64 = await this.fileService.readAsBase64(file);
      this.control.setValue(base64);
      this.control.setErrors(null);
    } catch (e) {
      this.errorMsg = 'Error reading file';
      this.control.setErrors({ read: true });
    }
  }
}
