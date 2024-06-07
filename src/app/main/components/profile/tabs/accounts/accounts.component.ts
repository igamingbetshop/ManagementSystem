import {Component, Injector, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Controllers, GridRowModelTypes, Methods} from 'src/app/core/enums';
import {ApiService, ConfigService, LocalStorageService} from 'src/app/core/services';
import 'ag-grid-enterprise';
import {take} from 'rxjs/operators';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import { BaseGridComponent } from '../../../classes/base-grid-component';
import { DateHelper } from '../../../partner-date-filter/data-helper.class';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent extends BaseGridComponent implements OnInit {

  public rowData = [];
  public filter: any = {};
  public id;
  public fromDate = new Date();
  public toDate = new Date();
  public selectedItem = 'today';
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    private apiService: ApiService,
    protected configService: ConfigService,
    protected injector: Injector,
    private localStorage: LocalStorageService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Payments.TransactionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.DocumentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.AccountId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Bonuses.AccountType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AccountType',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.BalanceBefore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceBefore',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Payments.OperationType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationType',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Products.ProductName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.PaymentSystemName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Payments.OperationAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationAmount',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Payments.BalanceAfter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceAfter',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Payments.OperationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationTime',
        sortable: true,
        resizable: true,
        filter: false,
      },
    ];
  }

  ngOnInit() {
    this.setTime();
    this.id = this.localStorage.get('user')?.UserId;
    this.getPage();
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  go() {
    this.getPage();
  }


  getPage() {
    this.filter.FromDate = this.fromDate;
    this.filter.ToDate = this.toDate;
    this.filter.UserId = this.id;
    this.apiGetPage(this.filter).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  apiGetPage(filter) {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.GET_USER_ACCOUNTS_BALANCE_HISTORY_PAGING;
    request.Controller = Controllers.USER;
    request.RequestObject = {...request, ...filter}
    return this.apiService.apiPost(url, request);
  }

}
