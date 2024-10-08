import { Component, Injector, Input, OnInit, Output, ViewChild, EventEmitter, input, output } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { IRowNode } from 'ag-grid-community';
import { SETTELMENT_STATUSES } from 'src/app/core/constantes/statuses';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SelectStateRendererComponent } from 'src/app/main/components/grid-common/select-state-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';

@Component({
  selector: 'app-configurations-grid',
  templateUrl: './configurations-grid.component.html',
  styleUrls: ['./configurations-grid.component.scss'],
  standalone: true,
  imports: [
    AgGridModule,
  ]
})
export class ConfigurationsComponent extends BaseGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  settlementStatuses = SETTELMENT_STATUSES;  
  rowData = input<[]>();;
  changeValue = output<[]>();

  frameworkComponents = {
    selectStateRenderer: SelectStateRendererComponent,
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  };

  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowHeight = 42;
  type: any;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    suppressMenu: true,
  };

  constructor(
    injector: Injector,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Common.BooleanValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BooleanValue',
        cellRenderer: 'selectStateRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange.bind(this),
          Selections: this.settlementStatuses,
        },
      },
      {
        headerName: 'Common.NumericValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NumericValue',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.StringValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StringValue',
        tooltipValueGetter: (params) => `${params.value}`,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        cellRenderer: (params) => new Date(params.value).toLocaleString()
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        cellRenderer: (params) => new Date(params.value).toLocaleString()
      }
    ];
  }

  ngOnInit(): void {}

  selectRow(rowData) {
    const rowNode = this.gridApi.getRowNode(rowData.Id);
    if (rowNode) {
      this.gridApi.ensureIndexVisible(rowNode.rowIndex);
      this.gridApi.getSelectedNodes().forEach(node => node.setSelected(false));
      rowNode.setSelected(true);
    }
  }

  changeConfigurations(event) {

    this.rowData().forEach((element, index) => {
      if (element['Id'] === event.Id) {
        this.rowData[index] = event;
      }
    });

    this.changeValue.emit(this.rowData());
  }

  onSelectChange(params, value: number, event) {
      params.BooleanValue = value;
      this.onCellValueChanged(event);
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
    this.gridApi = params.api; // Initialize gridApi
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      });

      this.changeConfigurations(findedNode.data);
      // this.gridApi.redrawRows({ rowNodes: [findedNode] });
      // console.log(this.changeConfigurations(findedNode.data));

      
    }
  }
}