import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import 'ag-grid-enterprise';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';


@Component({
  selector: 'app-mapped-market-types-gird',
  templateUrl: './mapped-market-types-gird.component.html',
  styleUrls: ['./mapped-market-types-gird.component.scss']
})
export class MappedMarketTypesGridComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Input() sports: any[] = [];
  @Input() providers: any[] = [];
  @Output() mappedRowSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() mappedDetailRowSelected: EventEmitter<boolean> = new EventEmitter<boolean>();


  public sportId: number | null;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  public isDetailSelected = false;
  public rowDetailed: any;
  public deteledGridOption;

  public masterDetail;
  public detailGridParams: any;

  public detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 40,

      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },

      suppressRowClickSelection: "isCanNotSelect",

      columnDefs: [
        {
          headerName: 'Common.Id',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id',
          sortable: true,
          resizable: true,
          checkboxSelection: true,
          cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
          filter: 'agNumberColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.numberOptions
          },
        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Name',
          resizable: true,
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.textOptions
          },
        },
      ],
      onGridReady: params => {
        this.deteledGridOption = params.api;
      },

      onRowSelected: params => {
        if (!this.isUnknownRowSelected()) {
          SnackBarHelper.show(this._snackBar, { Description: 'You have to select correct items.', Type: "success" });
          this.agGrid.api?.deselectAll();
          this.deteledGridOption?.deselectAll();
          return;
        }

        if (params.node.isSelected()) {
          this.rowDetailed = params.node.data;
          this.mappedDetailRowSelected.emit(true);

        }
        if (params.api.getSelectedNodes().length == 0) {
          this.rowDetailed = null;
        }
      },
    },
    getDetailRowData: params => {
      if (params) {
        let nestedRowData: any[] = [];
        let marketType = this.rowData.find(row => {
          return row.Id == params.data.Id;
        })
        if (marketType) {
          nestedRowData = marketType.Selections;
        }
        params.successCallback(nestedRowData);
      }

    },
    template: params => {
      this.detailGridParams = params;
      const name = params.data.Id;
      return `<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">
                  <div style="height: 10%; font-weight: 700; font-size: 16px; color: #076192 "> ${name}</div>
                  <div ref="eDetailGrid" style="height: 90%;"></div>
               </div>`
    }
  }
  public frameworkComponents;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
    };

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellRenderer: 'agGroupCellRenderer',
        checkboxSelection: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
    ];

    this.masterDetail = true;
  }

  ngOnInit() {
    this.gridStateName = 'map-market-types-grid-state';
    this.getProviders();
    this.getSports();
    this.getRows();
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onSportChange(val) {
    this.sportId = val;
    this.go();
  }

  go() {
    this.getRows();
  }


  isUnknownRowSelected() {
    return this.agGrid.api && this.agGrid.api.getSelectedRows().length === 0;
  };

  onRowSelected() {
    this.mappedRowSelected.emit(true);
  }


  onGridReady(params) {
    super.onGridReady(params);
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }

  onRowGroupOpened(params) {
    if (params.node.expanded) {
      this.agGrid.api.forEachNode(function (node) {
        if (
          node.expanded &&
          node.id !== params.node.id &&
          node.uiLevel === params.node.uiLevel
        ) {
          node.setExpanded(false);
        }
      });
    }
  }

  getRows() {
    let filter = {
      PageIndex: 0,
      PageSize: 5000,
      SportIds: {},
      SportId: null,
    }
    if (this.sportId) {
      filter.SportIds = {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
      };
    } else {
      delete filter.SportIds;
    }
    filter.SportId = this.sportId;
    this.apiService.apiPost('markettypes/markettypesformapping', filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Objects;


        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.getRows()
  }

  isRowSelected() {
    return this.gridApi && this.gridApi?.getSelectedRows().length === 0;
  };

}
