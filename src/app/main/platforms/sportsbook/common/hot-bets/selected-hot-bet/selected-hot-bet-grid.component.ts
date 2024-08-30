import { Component, EventEmitter, Injector, Output, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { GridRowModelTypes } from 'src/app/core/enums';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';

@Component({
  selector: 'app-selected-hot-bet-grid',
  templateUrl: './selected-hot-bet-grid.component.html',
  styleUrls: ['./selected-hot-bet-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    AgGridModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class SelectedHotBetGridComponent extends BaseGridComponent {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  rowData = input<[]>();
  @Output() isRowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateRow: EventEmitter<any> = new EventEmitter<any>();

  public frameworkComponents = {
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
    buttonRenderer: ButtonRendererComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Sport.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
      },
    ]
  }

  isUnknownRowSelected() {
    return this.agGrid.api && this.agGrid.api.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
  }

  updateSetting(params) {
    const row = params.data;
    this.updateRow.emit(row);
  }

  onRowSelected() {
    let row = this.agGrid.api.getSelectedRows()[0];    
    this.isRowSelected.emit(row);
  }

}
