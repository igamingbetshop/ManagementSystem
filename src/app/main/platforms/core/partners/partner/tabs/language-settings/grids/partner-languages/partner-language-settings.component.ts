import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";

import 'ag-grid-enterprise';
import { CellValueChangedEvent, IRowNode } from "ag-grid-community";

import { GridRowModelTypes } from "../../../../../../../../../core/enums";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-partner-language-settings',
  templateUrl: './partner-language-settings.component.html',
  styleUrls: ['./partner-language-settings.component.scss']
})
export class PartnerLanguageSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @Output() editPattnerLanguageSettings = new EventEmitter<any>();
  @Input() partnersRowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public columnDefs = [];
  public statusName = ACTIVITY_STATUSES;

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
    this.columnDefs = [
      {
        field: '',
        minWidth: 20,
        checkboxSelection: true,
        filter: false,
      },
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
      }
    ];
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        sortable: true,
        resizable: true,
        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        cellEditor: 'numericEditor',        
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        editable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange1['bind'](this),
          Selections: this.statusName,
        },
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.editLanguageSetting['bind'](this),
          Label: 'Save',
          isDisabled: true,
        }
      },
    ]
  }

  onSelectChange1(params, val, param) {
    params.State = val;
    this.onCellValueChanged(param)
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  editLanguageSetting(params) {
    this.editPattnerLanguageSettings.emit(params.data);
    this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
  }

}
