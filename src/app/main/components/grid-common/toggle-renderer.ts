import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { _ } from 'ag-grid-community';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-checkbox-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="label" style="display: flex; justify-content: center; height: 25px; align-items: center;">
    <mat-slide-toggle color="primary" (change)="onChange($event.checked)" [checked]="params.value">      </mat-slide-toggle>
    </div>
  `,
  styles: [
    '::ng-deep .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar { background-color: #b3c9d6; }',
    '::ng-deep .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb { background-color: #076192; }'
  ]
})
export class ToggleRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return false;
  }

  onChange(checked: boolean): void {
      this.params.onCellValueChanged({
          ...this.params.data,
      });
  }
}




