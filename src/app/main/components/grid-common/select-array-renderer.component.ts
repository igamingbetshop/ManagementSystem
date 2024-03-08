import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {ICellRendererParams} from "ag-grid-community";


@Component({
  selector: 'app-select-array-renderer',
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
  template: `{{ displayValue }}`
})


export class SelectArrayRendererComponent implements ICellRendererAngularComp {
  public displayValue: string;
  public params;

  agInit(params: ICellRendererParams): void {
    this.params = params;

    if(params.value) {
      this.displayValue = params.value.map((v: number) => {
        const matchingObj = this.params.Selections.find((item: any) => item.Id === v);
        return matchingObj ? matchingObj.Name : '';
      }).join(', ');
    }
  }

  refresh(params: any): boolean {
    return false;
  }
}
