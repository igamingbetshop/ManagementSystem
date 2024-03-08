import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from "ag-grid-community";


@Component({
  selector: 'app-input-multi-select',
  template: `
    <div class="container"
         [class.show] = "params.data.IsForAll === false && params.data.Permissionid !== 'ViewPartner' && params.data.Permissionid !== 'CreatePartner'">
      <input placeholder="example: 1,2,3,4" [ngModel]="textInput" (ngModelChange)="onInputChange($event)"/>
    </div>

    <div class="container" [class.show] = "params.data.Permissionid === 'ViewPartner' || params.data.Permissionid === 'CreatePartner'">
      <!-- <mat-form-field> -->
        <mat-select
          (selectionChange)="onMultipleSelect($event.value)"
          [(value)]="accessObjectsIds"
          multiple>
          <mat-option *ngFor="let selection of selections" [value]="selection.Id">{{selection.Name}} - {{selection.Id}} </mat-option>
        </mat-select>
      <!-- </mat-form-field> -->
    </div>`,
  styles: ['.container {display: none} .show {display: block;} .container input {padding: 5px 10px; outline: none;}']
})

export class InputMultiSelectComponent implements ICellRendererAngularComp {
  public textInput: string;
  public params;
  public selections: any[] = [];
  public accessObjectsIds: number[];

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.textInput = String(this.params.data.AccessObjectsIds) || null;
    this.selections = this.params.Selections || null;
    this.accessObjectsIds = this.params.data.AccessObjectsIds;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onMultipleSelect(ids: number[]) {
    if (this.params.onMultipleSelect instanceof Function) {
      this.params.onMultipleSelect(ids, this.params);
    }
  }

  onInputChange(value: string) {
    this.params.onInputChange(value, this.params);
  }

}
