import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-input-multi-select',
  template: `
    <div class="container"
         [class.show]="!params.data.IsForAll && params.data.Permissionid !== 'ViewPartner' && params.data.Permissionid !== 'CreatePartner'">
      <input placeholder="example: 1,2,3,4" [ngModel]="textInput" (ngModelChange)="onInputChange($event)" />
    </div>

    <div class="container"
         [class.show]="params.data.Permissionid === 'ViewPartner' || params.data.Permissionid === 'CreatePartner'">
      <mat-select (selectionChange)="onMultipleSelect($event.value)"
                  [(ngModel)]="accessObjectsIds"
                  multiple>
        <mat-option *ngFor="let selection of selections" [value]="selection.Id">{{ selection.Name }} - {{ selection.Id }}</mat-option>
      </mat-select>
    </div>
  `,
  styles: ['.container {display: none} .show {display: block;} .container input {padding: 5px 10px; outline: none;}']
})
export class InputMultiSelectComponent implements ICellRendererAngularComp {
  public textInput: string;
  public params: any;
  public selections: any[] = [];
  public accessObjectsIds: string[] = [];  // Ensure it's an array of strings

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.textInput = this.params.data.AccessObjectsIds ? this.params.data.AccessObjectsIds.join(',') : '';
    this.selections = this.params.Selections || [];
    this.accessObjectsIds = this.params.data.AccessObjectsIds ? this.params.data.AccessObjectsIds.map(Number) : [];
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.textInput = this.params.data.AccessObjectsIds ? this.params.data.AccessObjectsIds.join(',') : '';
    this.accessObjectsIds = this.params.data.AccessObjectsIds ? this.params.data.AccessObjectsIds.map(Number) : [];
    return true;
  }

  onMultipleSelect(ids: string[]): void {
    this.accessObjectsIds = ids;
    if (this.params.onMultipleSelect instanceof Function) {
      this.params.onMultipleSelect(ids, this.params);
    }
  }

  onInputChange(value: string): void {
    this.textInput = value;
    if (this.params.onInputChange instanceof Function) {
      this.params.onInputChange(value, this.params);
    }
  }
}
