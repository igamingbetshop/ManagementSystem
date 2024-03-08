import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from "ag-grid-community";


@Component({
  selector: 'app-select-renderer',
  template: `<div>
     <!-- <mat-form-field> -->
        <mat-select   #sel  (ngModelChange)="onChange(sel.value, $event)" [(ngModel)]="params.value">
          <mat-option *ngFor="let selection of selections" [value]="selection.Id">{{selection.Name}}</mat-option>
        </mat-select>
     <!-- </mat-form-field> -->
</div>`,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
})


export class SelectRendererComponent implements ICellRendererAngularComp {

  public params;
  public selections: any[] = [];

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.selections = this.params.Selections || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onChange(val, params) {
    if (this.params.onchange instanceof Function) {
      this.params.onchange(this.params.data, val, this.params);
    }
  }
}
