import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { syncColumnNestedSelectPanel, syncColumnSelectPanel, syncNestedColumnReset } from "../../../../../../../core/helpers/ag-grid.helper";
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../../../services/export.service";

@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.scss']
})
export class AccountHistoryComponent extends BaseGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  clientId: number;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = [];
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  selectedItem = 'today';
  accounts = [];
  accountId = null;
  pageIdName: string;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    private exportService: ExportService,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Payments.TransactionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionId',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.DocumentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Account Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Bonuses.AccountType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountType',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        }
      },
      {
        headerName: 'Clients.BalanceBefore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceBefore',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Operation Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationType',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        }
      },
      {
        headerName: 'Payments.PaymentMethod',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.OperationAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationAmount',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.BalanceAfter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceAfter',
        sortable: true,
        resizable: true,
        tooltipField: 'BalanceAfter',
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.OperationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.OperationTime, 'medium');
          return `${dat}`;
        },
      },
    ];
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getClientAccounts();
    this.setTime();
    this.pageIdName = `/ ${this.clientId} : ${this.translate.instant('Clients.AccountHistory')}`;
    this.adminMenuId = GridMenuIds.CLIENTS_ACCOUNT_HISTORY;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getData();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getClientAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.accounts = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSelectAccountType(event) {
    this.accountId = event;
    this.getData();
  }

  onGridReady(params) {
    syncColumnNestedSelectPanel();
    syncNestedColumnReset();
    super.onGridReady(params);
    this.getData();

    syncColumnSelectPanel();
  }

  getData() {
    this.clientData = {
      ClientId: this.clientId,
      FromDate: this.fromDate,
      ToDate: this.toDate,
      AccountId: this.accountId

    };
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS_BALANCE_HISTORY_PAGING).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  exportToCsv() {
    this.exportService.exportToCsv(Controllers.CLIENT, Methods.EXPORT_CLIENT_ACCOUNTS_BALANCE_HISTORY, this.clientData);
  }

  onNavigateToClient() {
    this.router.navigate(["/main/platform/clients/all-clients"])
  }

}
