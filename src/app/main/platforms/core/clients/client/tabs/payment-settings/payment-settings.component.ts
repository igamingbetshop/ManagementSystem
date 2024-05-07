import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Client } from "../../../../../../../core/interfaces";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { ConfigService } from "../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  clientId: number;
  client: Client;
  formGroup: UntypedFormGroup;
  paymentLimits;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  selectedRowId: number = 0;
  blockedData;
  selected = false;
  isEdit = false;
  paymentsEnum: any;
  currencyId: any;

  constructor(
    private apiService: CoreApiService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    protected injector: Injector,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');

  }

  ngOnInit(): void {
    this.getClientPaymentStatesEnum();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.FormValues();
    this.getClient();
    this.getPaymentLimit();
    this.getClientPaymetSettings();
  }

  getClient() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.client = data.ResponseObject.Client;
          this.currencyId = data.ResponseObject.Client.CurrencyId;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }

  setColdef() {
    this.columnDefs = [
      {
        headerName: 'Payments.PaymentSettingId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerPaymentSettingId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Partners.PaymentSystem',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystem',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: (params: { value: any; }) => {
          const typeId = params.value;
          const typeObject = this.paymentsEnum?.find((type) => type.Id === typeId);

          if (typeObject) {
            return typeObject.Name;
          }
          return 'Unknown type';
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: false,
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      }

    ];
  }

  getClientPaymetSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId,
      true, Controllers.CLIENT, Methods.GET_CLIENT_PAYMENT_SETTINGS).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getPaymentLimit() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_PAYMENT_LIMIT).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.paymentLimits = data.ResponseObject;
          this.formGroup.patchValue(this.paymentLimits);
        }
      });
  }

  getClientPaymentStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_PAYMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentsEnum = data.ResponseObject;
        }
        this.setColdef();
      });
  }

  private FormValues() {
    this.formGroup = this.fb.group({
      ClientId: [this.clientId],
      MaxDepositAmount: [null],
      MaxDepositsCountPerDay: [null],
      MaxWithdrawCountPerDay: [null],
      MaxTotalDepositsAmountPerWeek: [null],
      MaxTotalWithdrawsAmountPerDay: [null],
      MaxTotalWithdrawsAmountPerMonth: [null],
      MaxWithdrawAmount: [null],
      EndTime: [null],
      StartTime: [null]
    })
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    } else {
      const client = this.formGroup.getRawValue();
      this.apiService.apiPost(this.configService.getApiUrl, client, true,
        Controllers.CLIENT, Methods.SET_PAYMENT_LIMIT).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            this.isEdit = false;
            this.getPaymentLimit();
            SnackBarHelper.show(this._snackBar, {
              Description: 'The Payment Limit has been updated successfully',
              Type: "success"
            });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  get errorControls() {
    return this.formGroup.controls;
  }

  public cancel() {
    this.formGroup.reset();
  }

  onGridReady(params) {
    this.selectedRowId = 0;
    super.onGridReady(params);
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.selected = true;
      this.blockedData = params
    } 
    
  }

  async addBlockedPayments() {
    const { AddBlockedPaymentsComponent } = await import('../payment-settings/add-blocked-payments/add-blocked-payments.component');
    const dialogRef = this.dialog.open(AddBlockedPaymentsComponent, 
      { width: ModalSizes.MEDIUM, 
        data: {
          clientId: this.clientId,
          currencyId: this.currencyId,
          partnerId: this.client.PartnerId,
        }
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientPaymetSettings();
      }
    });
  }

  removeBlockedPayments() {
    if (!this.blockedData) {
      this.selected = false;
    } else {
      const blockedData = { PartnerPaymentSettingId: this.blockedData.data.PartnerPaymentSettingId, State: 1, ClientId: +this.clientId }
      this.apiService.apiPost(this.configService.getApiUrl, blockedData, true,
        Controllers.CLIENT, Methods.SAVE_CLIENT_PAYMENT_SETTING).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.getClientPaymetSettings();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })
    }
  }

}
