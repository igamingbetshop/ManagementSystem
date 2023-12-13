import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AgGridAngular } from "ag-grid-angular";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DateAdapter } from "@angular/material/core";

import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { Controllers, GridMenuIds, Methods } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from "../../../../../../../core/helpers/datetime.helper";
import { Paging } from 'src/app/core/models';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends BasePaginatedGridComponent implements OnInit, AfterViewInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId?: number;
  public rowData = [];
  public statusNames = [];
  public operationTypesArray = [];
  public partnerId?: number;
  public fromDate = new Date();
  public toDate = new Date();
  public pageFilter = {};
  public selectedItem = 'today';
  public partners = [];
  public operationTypesEnum;
  savedFilterModel;
  public accounts = [];
  public accountId = null;
  public frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };

  constructor(
    protected apiService: CoreApiService,
    protected activateRoute: ActivatedRoute,
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    protected configService: ConfigService,
    protected _snackBar: MatSnackBar,
    protected dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    // this.adminMenuId = GridMenuIds.CLIENTS_TRANSACTIONS;
    this.dateAdapter.setLocale('en-GB');
  }


  ngAfterViewInit(): void {
    this.getFilterModelFromLocalStorage();
  }

  ngOnInit(): void {
    this.getOperationTypesEnum();
    this.startDate();
    this.partners = this.commonDataService.partners || null;
    this.clientId = +this.activateRoute.snapshot.queryParams.clientId || null;
    this.getClientAccounts();
  }

  setColumnDefs() {
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
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
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
        headerName: 'Dashboard.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
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
        headerName: 'Payments.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
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
        headerName: 'Common.ExternalTransactionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalTransactionId',
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
        headerName: 'VirtualGames.RoundId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
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
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.statusNames,
        },
      },
      {
        headerName: 'Common.OperationTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTypeId',
        sortable: true,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.operationTypesArray,
        }
      },
      {
        headerName: 'Common.TypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
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
        headerName: 'Common.PaymentRequestId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentRequestId',
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
        headerName: 'Clients.PaymentSystemName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
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
        headerName: 'Products.GameProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderName',
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
        headerName: 'Products.ProductName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
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
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
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
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ];
  }

  getClientAccounts() {
    if(this.clientId) {
      this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
        Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.accounts = data.ResponseObject;
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  onSelectAccountType(event) {
    this.accountId = event;
    this.getCurrentPage();
  }

  getOperationTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_OPERATION_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          let { ResponseObject } = data;
          ResponseObject.forEach(element => {
            this.operationTypesArray.push(String(element.NickName));
          });
          this.operationTypesEnum = this.setEnum(data.ResponseObject);
          this.getDocumenStatesEnum();
        }
      });
  }

  getDocumenStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.statusNames = data.ResponseObject;
          this.setColumnDefs();
        }
      });
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.selectedItem = time;
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  onGridReady(params) {
    syncNestedColumnReset();
    super.onGridReady(params);
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        if (this.clientId) {
          paging.ClientId = this.clientId;
        }
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.AccountId = this.accountId;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.pageFilter = {...paging};
        if(this.pageFilter['OperationTypeIds']?.ApiOperationTypeList[0].ArrayValue.length === 0) {
          delete this.pageFilter['OperationTypeIds'];
        }
        if(this.pageFilter['OperationTypeIds']) {
          this.pageFilter['OperationTypeIds'].ApiOperationTypeList[0].ArrayValue = this.transformArrayToNumbers(this.pageFilter['OperationTypeIds'].ApiOperationTypeList[0].ArrayValue, this.operationTypesEnum);
        }

        this.apiService.apiPost(this.configService.getApiUrl,  this.pageFilter, true,
          Controllers.CLIENT, Methods.GET_CLIENT_DOCUMENTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((items) => {
                items.State = this.statusNames.find((item => item.Id === items.State))?.Name;
                items.OperationTypeId = this.operationTypesEnum[items.OperationTypeId];
              });
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  saveFilterModelToLocalStorage() {
    const filterModel = this.gridApi?.getFilterModel();
    this.localstorageService.add('agGridFilterModel', filterModel)
  }

  getFilterModelFromLocalStorage() {
    const filterModel = this.localstorageService.get('agGridFilterModel');
    setTimeout(() => {
      this.gridApi?.setFilterModel(filterModel);
    }, 1000);
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    this.apiService.apiPost(this.configService.getApiUrl, this.pageFilter, true,
      Controllers.CLIENT, Methods.EXPORT_CLIENT_DOCUMENTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          var iframe = document.createElement("iframe");
          iframe.setAttribute("src", this.configService.defaultOptions.WebApiUrl + '/' + data.ResponseObject.ExportedFilePath);
          iframe.setAttribute("style", "display: none");
          document.body.appendChild(iframe);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  transformArrayToNumbers(array, obj) {
    if (array.every(function (element) {
      return typeof element === 'number';
    })) {
      return array
    }
    const result = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      const key = Object.keys(obj).find((key) => obj[key] === item);
      if (key) {
        result.push(Number(key));
      }
    }
    return result;
  }

}
