import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

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
  selector: 'app-unmapped-market-types-gird',
  templateUrl: './unmapped-market-types-gird.component.html',
  styleUrls: ['./unmapped-market-types-gird.component.scss']
})
export class UnmappedMarketTypesGridComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() unmappedRowSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() sports: any[] = [];
  @Input() providers: any[] = [];
  @Output() isDetailUnmappedSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  public sportId: number | null;

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  public isCanNotSelect = true;
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

      columnDefs: [
        {
          headerName: 'Common.Id',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id',
          sortable: true,
          checkboxSelection: true,
          resizable: true,
          cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
          filter: 'agNumberColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.numberOptions
          },
        },
        {
          headerName: 'Products.ExternalId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ExternalId',
          resizable: true,
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.textOptions
          },
        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'NickName',
          resizable: true,
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.textOptions
          },
        },
        {
          headerName: 'Partners.Provider',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ProviderName',
          resizable: true,
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.textOptions
          },
        },
        {
          headerName: 'Sport.SportName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'SportNickName',
          resizable: true,
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.textOptions
          },
        },
        {
          headerName: 'Payments.Date',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'CreationDate',
          sortable: true,
          filter: 'agDateColumnFilter',
          cellRenderer: function (params) {
            let datePipe = new DatePipe("en-US");
            let dat = datePipe.transform(params.data.CreationDate, 'medium');
            return `${dat}`;
          },
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.numberOptions
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
          this.onRowSelected();
        }
        if (params.api.getSelectedNodes().length == 0) {
          this.rowDetailed = null;
        }

        this.isDetailUnmappedSelected.emit(!(params.api.getSelectedNodes().length == 0));
      }
    },
    getDetailRowData: params => {
      if (params) {
        this.apiService.apiPost('common/unknowns', {
          "ObjectTypeId": 8,
          "ParentId": params.data.Id,
          PageIndex: 0,
          PageSize: 1000,
        })
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              const nestedRowData = data.Objects;
              nestedRowData.forEach(sport => {
                let providerName = this.providers.find((provider) => {
                  return provider.Id == sport.ProviderId;
                })
                if (providerName) {
                  sport['ProviderName'] = providerName.Name;
                }
              })

              params.successCallback(nestedRowData);
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          })
      }
    },
    template: params => {
      this.detailGridParams = params;
      const name = params.data.Id;
      return `
         <div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">
            <div style="height: 10%; font-weight: 700; font-size: 16px; color: #076192 "> ${name}</div>
            <div ref="eDetailGrid" style="height: 90%;"></div>
         </div>`
    }
  }

  public frameworkComponents;
  public filteredRowData;

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
        checkboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.External Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Sport Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportNickName',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
        sortable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationDate, 'medium');
          return `${dat}`;
        },
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
    this.getRows();
  }

  isUnknownRowSelected() {
    return this.agGrid.api && this.agGrid.api.getSelectedRows().length === 0;
  };

  onRowSelected() {
    this.unmappedRowSelected.emit(true);
  }

  onGridReady(params) {
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
      ObjectTypeId: 6,
      SportIds: {},
    }

    if (this.sportId) {
      filter.SportIds = {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
      };
    } else {
      delete filter.SportIds;
    }

    this.apiService.apiPost('common/unknowns', filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Objects;
          this.rowData.forEach(sport => {
            let providerName = this.providers.find((provider) => {
              return provider.Id == sport.ProviderId;
            })
            if (providerName) {
              sport['ProviderName'] = providerName.Name;
            }
          })

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
