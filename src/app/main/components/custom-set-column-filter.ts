// custom-set-column-filter.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgFrameworkComponent } from 'ag-grid-angular';

@Component({
    selector: 'app-custom-dropdown-filter',
    template: `
      <select [(ngModel)]="selectedValue" (ngModelChange)="onChange()">
        <option *ngFor="let option of options" [value]="option.value">{{ option.text }}</option>
      </select>
    `,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CustomDropdownFilterComponent {
    @Input() options: any[] = [];
    @Output() valueChanged = new EventEmitter<number | null>();
  
    public selectedValue: number | null = null;
  
    onChange(): void {
      this.valueChanged.emit(this.selectedValue);
    }
  }
