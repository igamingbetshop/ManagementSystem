import { Component } from '@angular/core';
import { ICellEditorParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";


const KEY_ENTER = 'Enter';

@Component({
  selector: 'app-array-editor-cell',
  templateUrl: './array-editor.component.html',
  styleUrls: ['./array-editor.componen.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    TranslateModule
  ],
})
export class ArrayEditorComponent implements ICellEditorAngularComp {

  private params: ICellEditorParams;
  public items;
  public myItem: number | null;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.items = (params.value);
  }

  getValue(): any {
    return this.items;
  }

  isPopup(): boolean {
    return true;
  }

  onItemChanged(): void {
    this.params.api.stopEditing();
  }

  addItem(): void {
    this.items.push(this.myItem);
    this.myItem = null
  }

  deleteItem(index: number): void {
    this.items.splice(index, 1);
    return this.items;
  }

  stopEditing(saveChanges: boolean): void {
    if (saveChanges) {
      this.params.api.stopEditing();
    } else {
      this.params.api.stopEditing(true);
    }
  }

  onKeyDown(event: any): void {
    if (event.key == KEY_ENTER) {
      this.addItem();
    }

  }
}
