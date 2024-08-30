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
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";

@Component({
  selector: 'app-selected-teaser-grid',
  templateUrl: './selected-teaser-grid.component.html',
  styleUrls: ['./selected-teaser-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    AgGridModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class SelectedTeaserGridComponent extends BaseGridComponent {

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
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketTypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.BasePoint',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BasePoint',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.updateSetting['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
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
