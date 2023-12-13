import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {take} from "rxjs/operators";

import {AgGridAngular} from "ag-grid-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {CoreApiService} from "../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../core/services";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes} from "../../../../../core/enums";

@Component({
  selector: 'app-payment-forms',
  templateUrl: './payment-forms.component.html',
  styleUrls: ['./payment-forms.component.scss']
})
export class PaymentFormsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;
  public rowData = [];
  public rowData1 = [];
  public columnDefs1 = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners = [];
  public partnerId;
  public availableOptions = [
    {id: 1, name: 'Bank Transfer'},
    {id: 149, name: 'Bank Wire'},
  ];
  public selectedAvailableOptions;
  public paymentFormsState = true;
  public bankTransactionsState = false;
  public selectedData;

  constructor(private apiService: CoreApiService,
              public configService: ConfigService,
              public commonDataService: CommonDataService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              protected injector: Injector,
              private ref: ChangeDetectorRef) {
    super(injector);
    this.adminMenuId = GridMenuIds.PAYMENT_FORMS;
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
        suppressToolPanel: false,
      },
      {
        headerName: 'Payments.SubmittionDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
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
        headerName: 'Payments.BankName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankName',
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
        headerName: 'Payments.TransactionDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionDate',
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
        headerName: 'Payments.Amount',
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
      // {
      //   headerName: 'Type Name',
      //   field: 'Type',
      //   sortable: true,
      //   resizable: true,
      //   filter: 'agNumberColumnFilter',
      //   filterParams: {
      //     buttons: ['apply', 'reset'],
      //     closeOnApply: true,
      //     filterOptions: this.filterService.numberOptions
      //   },
      //   cellRenderer: params => {
      //     var a = document.createElement('div');
      //     if (params.data.Type == 1) {
      //       a.innerHTML = `Withdrawals`
      //     } else if (params.data.Type == 2) {
      //       a.innerHTML = `Deposits`
      //     }
      //     return a;
      //   },
      // },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name/Surname',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.CreatorFirstName !== null || params.data.CreatorLastName !== null) {
            a.innerHTML = params.data.CreatorFirstName + ' ' + params.data.CreatorLastName;
          }
          return a;
        },
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
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
        headerName: 'Payments.TransactionNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionNumber',
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
        headerName: 'Payments.SenderDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SenderDate',
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
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
      }
    ]
    this.columnDefs1 = [
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
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Date',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.Date, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.TransactionReference',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionReference',
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
        headerName: 'Payments.TransactionDetails',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TransactionDetails',
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
        headerName: 'Payments.BankName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankName',
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
        headerName: 'Users.User',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'User',
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
        headerName: 'Common.Company',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Company',
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
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
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
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
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
        headerName: 'Payments.PaymentAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentAmount',
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
        headerName: 'Payments.PaymentFee',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentFee',
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
        headerName: 'Payments.InternalReference',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'InternalReference',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ]
  }

  ngOnInit() {
    this.selectedAvailableOptions = this.availableOptions[0].id;
    this.partners = this.commonDataService.partners;
    this.partnerId = this.partners[0].Id;
    this.getPaymentRequestsPaging();
    this.getEntryList();
  }

  getPaymentRequestsPaging() {
    let request = {
      PartnerId: this.partnerId,
      PaymentSystemIds: {
        IsAnd: false,
        ApiOperationTypeList: [{OperationTypeId: 1, IntValue: this.selectedAvailableOptions}]
      },
      States: {
        IsAnd: true,
        ApiOperationTypeList: [{
          OperationTypeId: 1,
          IntValue: 1
        }]
      },
      Type: 2
    }
    this.apiService.apiPost(this.configService.getApiUrl, request, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_REQUESTS_PAGING).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject.PaymentRequests.Entities;
      }
    });
  }

  getEntryList() {
    let request = {
      PaymentSystemIds: [11, 12], PartnerId: this.partnerId
    }
    this.apiService.apiPost(this.configService.getApiUrl, request, true,
      Controllers.PAYMENT, Methods.GET_ENTRY_LIST).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData1 = data.ResponseObject;
      }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  async addDepositForm() {
    const {AddDepositFormComponent} = await import('./add-deposit-form/add-deposit-form.component');
    const dialogRef = this.dialog.open(AddDepositFormComponent, {
      width: ModalSizes.MEDIUM,
      data: {partnerId: this.partnerId}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPaymentRequestsPaging();
        this.getEntryList();
      }
    });
  }

  async addWithdrawForm() {
    const {AddWithdrawFormComponent} = await import('./add-withdraw-form/add-withdraw-form.component');
    const dialogRef = this.dialog.open(AddWithdrawFormComponent, {
      width: ModalSizes.MEDIUM,
      data: {partnerId: this.partnerId}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPaymentRequestsPaging();
        this.getEntryList();
      }
    });
  }

  go() {
    this.getPaymentRequestsPaging();
    this.getEntryList();
  }

  async mapTransactions() {
    const {MapTransactionsConfirmComponent} = await import('./map-transactions-confirm/map-transactions-confirm.component');
    const dialogRef = this.dialog.open(MapTransactionsConfirmComponent, {
      width: ModalSizes.SMALL,
      data: {paymentRequestId: this.selectedData}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPaymentRequestsPaging();
        this.getEntryList();
      }
    });
  }

  async rejectPaymentRequest() {
    const {RejectTransactionsConfirmComponent} = await import('./reject-transactions-confirm/reject-transactions-confirm.component');
    const dialogRef = this.dialog.open(RejectTransactionsConfirmComponent, {
      width: ModalSizes.SMALL,
      data: {paymentRequestId: this.selectedData}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPaymentRequestsPaging();
        this.getEntryList();
      }
    });
  }

  isRowSelected() {
    // return this.gridApi && this.gridApi?.getSelectedRows().length === 0;
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedData = params.data.Id;
    }
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

}
