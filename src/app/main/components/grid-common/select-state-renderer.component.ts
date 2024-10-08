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
  styles: [`
    .mat-mdc-select {
    height: 28px;
    border-radius: 6px;
    display: flex !important;
    align-items: center;
    width: 100px !important;
    padding: 0 8px 0 10px;
    background-color: #D1D1D2;
    color: $bg-color !important;

      &[aria-expanded="true"] {
        .mat-mdc-select-arrow {
          background-color: #D1D1D2!important;
          border-bottom: 5px solid #D1D1D2;
          border-top: 5px solid transparent;
          margin: 0 4px 4px 4px;
          svg {
            top: -200%;
            left: 0;
            transform: rotate(180deg);
          }
        }
      }

    .mat-mdc-select-trigger {
      .mat-mdc-select-value {
        color: $bg-color;

        .mat--mdc-select-placeholder {
          color: $bg-color;
          opacity: 0.9;
        }
      }

      .mat-mdc-select-arrow-wrapper {
        .mat-mdc-select-arrow {
          color: $bg-color;
        }
      }
    }

    &.mat-mdc-select-disabled {
      opacity: 0.7;
      pointer-events: none;
    }
  }

  ::ng-deep .custom-select-panel {
    width: 300px !important;
    min-width: 300px !important;
}
  `],
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

