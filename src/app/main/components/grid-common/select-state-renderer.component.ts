import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from "ag-grid-community";


@Component({
  selector: 'app-select-renderer',
  template: `<div>
        <mat-select #sel (ngModelChange)="onChange(sel.value, $event)" [(ngModel)]="params.value" style="padding-right: 5px;" [placeholder]="name">
          <mat-option *ngFor="let selection of selections" [value]="selection.Id">{{selection.Name}}</mat-option>
        </mat-select>
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
    TranslateModule,
  ],
})
export class SelectStateRendererComponent implements ICellRendererAngularComp {

  public params;
  public selections: any[] = [];

  public name:string;

  constructor(
    private translate: TranslateService,
  ) {
    this.name = this.translate.instant('Sport.None');
  }

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

