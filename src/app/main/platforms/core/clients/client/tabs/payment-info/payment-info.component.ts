import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../core/services";
import {MatDialog} from "@angular/material/dialog";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public selectedButton = false;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public selectedRow;
  public statuses;
  public statusesEnum;
  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
  };

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    protected injector: Injector,
    public dialog: MatDialog) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_PAYMENT_INFO;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.BankName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.Iban',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Iban',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.BankAccountNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankAccountNumber',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.BankSwiftCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BankSwiftCode',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.CardHolderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CardholderName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.CardNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CardNumber',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.CardExpireDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CardExpireDate',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CardExpireDate, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Clients.WalletNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WalletNumber',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.PaymentSystem',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystem',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Delete',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Delete',
        resizable: true,
        minWidth: 90,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.deleteCountrySettings['bind'](this),
          Label: this.translate.instant("Common.Delete"),
          isDisabled: true,
          bgColor: '#A30019',
          textColor: '#FFFFFF'
        }
      },
    ]
  }

  ngOnInit(): void {
    this.getClientPaymentInfoStates();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
  }

  getRowData() {
    this.apiService.apiPost(this.configService.getApiUrl, {ClientIdentifier: this.clientId}, true,
      Controllers.CLIENT, Methods.GET_CLIENT_PAYMENT_ACCOUNT_DETAILS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let entities = data.ResponseObject;
        entities.forEach(element => {
         return element.State = this.statusesEnum[element.State]
        });;
        this.rowData = entities;

      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  getClientPaymentInfoStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_PAYMENT_INFO_STATES).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.statuses = data.ResponseObject
        this.statusesEnum = this.setEnum(this.statuses);
        this.getRowData();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedButton = true;
      this.selectedRow = params
    } else {
      return;
    }
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncNestedColumnReset();
  }

  async openDialog(action, obj) {
    obj.action = action;
    const {AddAccountComponent} = await import('../payment-info/add-account/add-account.component');
    const dialogRef = this.dialog.open(AddAccountComponent, {width: ModalSizes.MEDIUM, data: obj});
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result.event == 'Add') {
        this.addAccount(result.data);
      } else if (result.event == 'Edit') {
        this.editAccount(result.data);
      }
      this.getRowData();
    });
  }

  addAccount(row_obj) {
    console.log(row_obj);
  }

  editAccount(row_obj) {
    this.selectedRow = row_obj;
  }

  resetDeposit() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.CLIENT, Methods.RESET_CLIENT_BANK_INFO).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, {Description: 'Deposit method Successfully Reseted', Type: "success"});
      }
    })
  }

  async deleteCountrySettings(params) {
    const request = {Id: params.data.Id};
    const { ConfirmComponent } = await import('../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      this.apiService.apiPost(this.configService.getApiUrl, request,
        true, Controllers.CLIENT, Methods.REMOVE_PAYMENT_ACCOUNT)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.getRowData();
            SnackBarHelper.show(this._snackBar, {Description: 'Provider successfully updated', Type: "success"});
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        })
      })
  }

}
