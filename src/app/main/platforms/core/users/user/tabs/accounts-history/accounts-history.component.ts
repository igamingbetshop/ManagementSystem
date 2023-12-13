import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridRowModelTypes, Methods} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import { ICellRendererParams } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-accounts-history',
  templateUrl: './accounts-history.component.html',
  styleUrls: ['./accounts-history.component.scss']
})
export class AccountsHistoryComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public userId: number;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public selectedItem = 'today';
  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector,
              public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Payments.TransactionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionId',
        sortable: true,
        resizable: true,
        tooltipField: 'TransactionId'
      },
      {
        headerName: 'Clients.DocumentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentId',
        sortable: true,
        resizable: true,
        tooltipField: 'DocumentId'
      },
      {
        headerName: 'Common.AccountId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountId',
        sortable: true,
        resizable: true,
        tooltipField: 'AccountId'
      },
      {
        headerName: 'Bonuses.AccountType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountType',
        sortable: true,
        resizable: true,
        tooltipField: 'AccountType'
      },
      {
        headerName: 'Products.ProductName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
        sortable: true,
        resizable: true,
        tooltipField: 'AccountType'
      },
      {
        headerName: 'Clients.BalanceBefore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceBefore',
        sortable: true,
        resizable: true,
        tooltipField: 'BalanceBefore'
      },
      {
        headerName: 'Payments.OperationType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationType',
        sortable: true,
        resizable: true,
        tooltipField: 'OperationType'
      },
      {
        headerName: 'Payments.PaymentMethod',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        tooltipField: 'PaymentSystemName'
      },
      {
        headerName: 'Payments.OperationAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationAmount',
        sortable: true,
        resizable: true,
        tooltipField: 'OperationAmount'
      },
      {
        headerName: 'Payments.BalanceAfter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceAfter',
        sortable: true,
        resizable: true,
        tooltipField: 'BalanceAfter',
        filter: 'agNumberColumnFilter'
      },
      {
        headerName: 'Payments.OperationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTime',
        sortable: true,
        resizable: true,
        tooltipField: 'OperationDate',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.OperationTime, 'medium');
          return `${dat}`;
        },
      },
    ];
  }

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
    this.selectTime('today');
  }

  selectTime(time) {
    let todayTime = new Date();
    let tomorrowTime = new Date();
    tomorrowTime.setHours(0);
    tomorrowTime.setMinutes(0);
    tomorrowTime.setSeconds(0);
    tomorrowTime.setMilliseconds(0);
    tomorrowTime.setDate(tomorrowTime.getDate() + 1);
    let fromDay = new Date();
    fromDay.setHours(0);
    fromDay.setMinutes(0);
    fromDay.setSeconds(0);
    fromDay.setMilliseconds(0);

    if (time === 'today') {
      todayTime.setHours(0);
      todayTime.setMinutes(0);
      todayTime.setSeconds(0);
      todayTime.setMilliseconds(0);
      this.fromDate = todayTime;
      this.toDate = tomorrowTime;
    } else if (time === 'yesterday') {
      todayTime.setHours(0);
      todayTime.setMinutes(0);
      todayTime.setSeconds(0);
      todayTime.setMilliseconds(0);
      todayTime.setDate(todayTime.getDate() - 1);
      this.fromDate = todayTime;
      this.toDate = fromDay;
    } else if (time === 'week') {
      todayTime.setHours(0);
      todayTime.setMinutes(0);
      todayTime.setSeconds(0);
      todayTime.setMilliseconds(0);
      todayTime.setDate(todayTime.getDate() - 7);
      this.fromDate = todayTime;
      this.toDate = tomorrowTime;
    } else if (time === 'month') {
      todayTime.setHours(0);
      todayTime.setMinutes(0);
      todayTime.setSeconds(0);
      todayTime.setMilliseconds(0);
      todayTime.setMonth(todayTime.getMonth() - 1);
      this.fromDate = todayTime;
      this.toDate = tomorrowTime;
    }
    this.clientData = {
      UserId: this.userId,
      FromDate: this.fromDate,
      ToDate: this.toDate
    }
    this.selectedItem = time;
    this.getData();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
    this.clientData = {
      UserId: this.userId,
      FromDate: new Date(this.fromDate.setDate(this.fromDate.getDate() + 1)),
      ToDate: this.toDate
    };
    this.getData();
  }

  onEndDateChange(event) {
    this.toDate = event.value;
    this.clientData = {
      UserId: this.userId,
      FromDate: this.fromDate,
      ToDate: new Date(this.toDate.setDate(this.toDate.getDate() + 1))
    };
    this.getData();
  }

  getData() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.USER, Methods.GET_USER_ACCOUNTS_BALANCE_HISTORY_PAGING).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
