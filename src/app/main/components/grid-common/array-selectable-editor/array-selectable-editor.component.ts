import { Component } from '@angular/core';
import { ICellEditorParams } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';

const KEY_ENTER = 'Enter';

@Component({
  selector: 'app-array-selectable-editor-cell',
  templateUrl: './array-selectable-editor.component.html',
  styleUrls: ['./array-selectable-editor.componen.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    TranslateModule,
    MatSelectModule
  ],
})
export class ArraySelectableEditorComponent implements ICellEditorAngularComp {

  private params: ICellEditorParams;
  public items: any[] = [];
  public options: any[];
  public displayValue: string;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.items = params.value || [];
    this.options = this.params['options'];
  }

  getValue(): any {
    return this.items;
  }

  isPopup(): boolean {
    return true;
  }

  onItemChanged(itemIds: number[]) {
    this.items = itemIds;
  }

  stopEditing(saveChanges: boolean): void {
    if (saveChanges) {
      this.params.api.stopEditing();
    } else {
      this.params.api.stopEditing(true);
    }
  }

  onKeyDown(event: any) {
    if (event.key === KEY_ENTER) {
      this.items = [...this.items]
    }
  }
}
