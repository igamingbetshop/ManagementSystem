import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Client} from "../../../../../../../core/interfaces";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {Controllers, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public client: Client;
  public formGroup: UntypedFormGroup;
  public paymentLimits;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public selectedRowId: number = 0;
  public blockedData;
  public selected = false;
  public isEdit = false;

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
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
    ]
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.FormValues();
    this.getPaymentLimit();
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId,
      true, Controllers.CLIENT, Methods.GET_CLIENT_BLOCKED_PAYMENTS).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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

  private FormValues() {
    this.formGroup = this.fb.group({
      ClientId: [this.clientId],
      MaxDepositAmount: [null],
      MaxDepositsCountPerDay: [null],
      MaxWithdrawCountPerDay: [null],
      // MaxTotalDepositsAmountPerDay: [null],
      // MaxTotalDepositsAmountPerMonth: [null],
      MaxTotalDepositsAmountPerWeek: [null],
      MaxTotalWithdrawsAmountPerDay: [null],
      MaxTotalWithdrawsAmountPerMonth: [null],
      // MaxTotalWithdrawsAmountPerWeek: [null],
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
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
    } else {
      this.selected = false;
      return;
    }
  }

  async addBlockedPayments() {
    const {AddBlockedPaymentsComponent} = await import('../payment-settings/add-blocked-payments/add-blocked-payments.component');
    const dialogRef = this.dialog.open(AddBlockedPaymentsComponent, {width: ModalSizes.MEDIUM});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.rowData.push(data);
        this.gridApi.setRowData(this.rowData);
      }
    });
  }

  removeBlockedPayments() {
    if (!this.blockedData) {
      this.selected = false;
    } else {
      const blockedData = {Id: this.blockedData.data.Id}
      this.apiService.apiPost(this.configService.getApiUrl, blockedData, true,
        Controllers.CLIENT, Methods.ACTIVATE_CLIENT_PAYMENT_SYSTEM).pipe(take(1)).subscribe((data) => {
        this.rowData.splice(this.blockedData.rowIndex, 1);
        this.gridApi.setRowData(this.rowData);
        this.selected = false;
      })
    }
  }

}
