import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { ModalSizes } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mapped-market-types',
  templateUrl: './mapped-market-types.component.html',
  styleUrls: ['./mapped-market-types.component.scss']
})
export class MappedMarketTypesComponent extends BasePaginatedGridComponent implements OnInit {

  rowData = [];
  providers: any[] = [];
  sports: any;
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };

  public detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: false,
        flex: 1,
      },
      components: this.frameworkComponents,
      columnDefs: [
        {
          headerName: 'Sport.CompetitionId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id',
        },
        {
          headerName: 'Products.ExternalId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ObjectExternalId',
        },
        {
          headerName: 'Sport.ExternalName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ObjectExternalName',
        },
        {
          headerName: 'Partners.Provider',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ProviderName',
        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'ObjectNickName',
        },
      ],
      onGridReady: params => {
      },
    },
    getDetailRowData: params => {
      if (params) {
        this.apiService.apiPost("markettypes/mappedselectiontypes", { "MarketTypeId": params.data.ObjectId, "ProviderId": params.data.ProviderId, "UnknownId": params.data?.UnknownId }).subscribe(data => {
          if (data.Code === 0) {
            this.rowDataNested = data.Objects;
            this.rowDataNested.forEach(row => {
              let providerName = this.providers.find((provider) => {
                return provider.Id == row.ProviderId;
              })
              if (providerName) {
                row['ProviderName'] = providerName.Name;
              }
            })
            params.successCallback(this.rowDataNested);
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })
      }
    },

    template: params => {
      return `<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">
                  <div style="height: 10%; font-weight: 700; font-size: 16px; color: #076192 "> Selections </div>
                  <div ref="eDetailGrid" style="height: 90%;"></div>
               </div>`
    }
  }
  rowDataNested: any;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.combineMethods();
    this.gridStateName = 'mapped-market-types-grid-state';
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 140,
        tooltipField: 'Id',
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: false,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.sports,
        },
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectExternalId',
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
        headerName: 'Sport.ExternalName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectExternalName',
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
        sortable: false,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.providers,
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectNickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ];
  }

  combineMethods() {
    const getSports$ = this.apiService.apiPost('sports');
    const getProviders$ = this.apiService.apiPost('providers');

    forkJoin([getSports$, getProviders$]).subscribe((results) => {
      const sportsData = results[0];
      const providersData = results[1];

      if (sportsData.Code === 0) {
        this.sports = sportsData.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: sportsData.Description, Type: "error" });
      }

      if (providersData.Code === 0) {
        this.providers = providersData.Objects;
        this.setColumnDefs(); // Call setColumnDefs() after both methods succeed.
      } else {
        SnackBarHelper.show(this._snackBar, { Description: providersData.Description, Type: "error" });
      }
    });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  mapping() {
    let row = this.gridApi.getSelectedRows()[0];
    let model = {
      Id: row.Id
    };
    this.apiService.apiPost('common/cancelmapping', model).subscribe(data => {
      if (data.Code === 0) {
        this.getCurrentPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async cancel() {
    const { ConfirmComponent } = await import('../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.mapping();
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = this.cacheBlockSize;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.ObjectTypeId = 6;
        this.changeFilerName(params.request.filterModel,
          ['SportName', 'ProviderName'], ['SportId', 'ProviderId']);
          this.setSort(params.request.sortModel, paging, "OrderByDescending");
          this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost('markettypes/mapped', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.Objects;
            mappedRows.forEach(sport => {
              let providerName = this.providers.find((provider) => {
                return provider.Id == sport.ProviderId;
              })
              if (providerName) {
                sport['ProviderName'] = providerName.Name;
              }
            })
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
