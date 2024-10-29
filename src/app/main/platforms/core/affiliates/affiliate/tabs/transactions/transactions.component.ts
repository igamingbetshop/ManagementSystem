import { Component, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AgGridAngular } from "ag-grid-angular";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DateAdapter } from "@angular/material/core";

import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { Controllers, Methods } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { Paging } from 'src/app/core/models';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../../../services/export.service";
import { DatePipe } from '@angular/common';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { formatDateTime } from 'src/app/core/utils';

export const CommissionTypes = [
  { Id: 1, Name: 'FixedFee' },
  { Id: 2, Name: 'Deposit' },
  { Id: 3, Name: 'Turnover' },
  { Id: 4, Name: 'GGR' },
  { Id: 5, Name: 'NGR' },
]

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  affiliateId?: number;
  rowData = [];
  statusNames = [];
  partnerId?: number;
  fromDate: any;;
  toDate: any;
  pageFilter = {};
  partners = [];
  savedFilterModel;
  accounts = [];
  accountId = null;
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
    agDateTimeFilter: AgDateTimeFilter
  };
  pageIdName = ''
  private exportService = inject(ExportService);
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
    this.dateAdapter.setLocale('en-GB');
  }


  ngOnInit(): void {
    this.setTime();
    this.getDocumenStatesEnum();
    this.partners = this.commonDataService.partners || null;
    this.affiliateId = +this.activateRoute.snapshot.queryParams.affiliateId;
    this.pageIdName = `/ ${this.affiliateId} : ${this.translate.instant('Clients.Transactions')}`;
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.partnerId = event.partnerId ? event.partnerId : null;
    this.getCurrentPage();
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
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
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
        headerName: 'Common.TypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: CommissionTypes,
          filterType: 'text'
        },
      },
      {
        headerName: 'Clients.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
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
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium') || "";
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium') || "";
          return `${dat}`;
        },
      },
    ];
  }

  onSelectAccountType(event) {
    this.accountId = event;
    this.getCurrentPage();
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
        if (this.affiliateId) {
          paging.AffiliateId = this.affiliateId;
        }
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.changeFilerName(params.request.filterModel,
          ['TypeName'], ['TransactionType']);

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.pageFilter = { ...paging };

        this.apiService.apiPost(this.configService.getApiUrl, paging, true,
          Controllers.AFFILIATES, Methods.GET_TRANSACTIONS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((items) => {
                items.State = this.statusNames?.find((item => item.Id === items.State))?.Name;
                items.TypeName = CommissionTypes.find((item => item.Id == items.TransactionType))?.Name;
              });
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
    this.exportService.exportToCsv(Controllers.REPORT, Methods.EXPORT_CLIENT_DOCUMENTS, this.pageFilter);
  }

  onNavigateToAffiliates() {
    this.router.navigate(["/main/platform/affiliates/all-affiliates"])
  }

}
