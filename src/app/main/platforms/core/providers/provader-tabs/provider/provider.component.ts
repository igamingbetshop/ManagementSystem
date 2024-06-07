import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CellClickedEvent } from 'ag-grid-community';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CoreApiService } from '../../../services/core-api.service';
import { syncColumnNestedSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import {ExportService} from "../../../services/export.service";

const statusModel = [
  { "Name": "active", "Id": 1 },
  { "Name": "inactive", "Id": 2 }
];

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent extends BasePaginatedGridComponent implements OnInit {
  providerId: number;
  rowData = [];
  frameworkComponents;
  filteredData;
  gameProviders: any[] = [];


  constructor(
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private exportService:ExportService
  ) {
    super(injector);

    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
    }
  }

  ngOnInit() {
    this.fetchProviders();
    this.providerId = +this.activateRoute.snapshot.queryParams.providerId;
  }

  setColdefs() {
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressColumnsToolPanel: false,
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
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Products.GameProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderName',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Providers.SubProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderName',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.gameProviders
        },
      },
      {
        headerName: 'Products.HasDemo',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HasDemo',
        resizable: true,
        sortable: true,
        filter: false,
        // filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Products.IsForDesktop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForDesktop',
        resizable: true,
        sortable: true,
        filter: false,
        // filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Products.IsForMobile',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForMobile',
        resizable: true,
        sortable: true,
        filter: false,
        // filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Description',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Level',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Level',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Products.MobileImageUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileImageUrl',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Products.WebImageUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WebImageUrl',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let status = params.data.State == 1 ? 'active' : params.data.State == 2 ? 'inactive' : '';
          return `${status}`;
        }
      },

    ];
  }


  fetchProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, { ParentId: this.providerId }, true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gameProviders = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);

          this.setColdefs();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  sync() {
    this.apiService.apiPost(this.configService.getApiUrl, this.providerId, true,
      Controllers.PRODUCT, Methods.SYNCHRONIZE_PROVIDER_PRODUCTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getCurrentPage();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onCellClicked(event: CellClickedEvent) {

  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnNestedSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        // paging.TakeCount = this.cacheBlockSize;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.GameProviderIds = {
          IsAnd: true,
          ApiOperationTypeList: [{
            OperationTypeId: 1,
            IntValue: this.providerId,
          }]
        };
        this.changeFilerName(params.request.filterModel,
          ['SubproviderName'], ['SubproviderId']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;

        console.log(paging, 'paging');

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
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

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.PRODUCT, Methods.EXPORT_PRODUCTS, this.filteredData);
  }
}
