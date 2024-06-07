import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { _ } from 'ag-grid-community';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-ag-checkbox-seected-renderer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule
  ],
  template: `
  <div class="label" style="display: flex; justify-content: center; height: 25px; align-items: center;">


      <mat-checkbox class="example-margin" [(ngModel)]="params.value" disabled></mat-checkbox>


  </div>`,
  styles: [
  '::ng-deep .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar  { background-color: #b3c9d6;}',
  '::ng-deep .mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb { background-color: #076192;}'
]

})

export class AGCheckboxSelectedRendererComponent implements ICellRendererAngularComp {

  params;

  agInit(params): void {
    this.params = params;    
  }

  refresh(params?: any): boolean {
    return true;
  }

  onChange(par, val,) {
    if (this.params.onchange instanceof Function) {
      this.params.onchange(par.data,val,par);
    }
  }
  
}




