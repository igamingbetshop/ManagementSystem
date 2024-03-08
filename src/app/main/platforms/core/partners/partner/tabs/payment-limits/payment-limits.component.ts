import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {Controllers, Methods, ModalSizes} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-payment-limits',
  templateUrl: './payment-limits.component.html',
  styleUrls: ['./payment-limits.component.scss']
})
export class PaymentLimitsComponent implements OnInit {
  public partnerId;
  public partnerName;
  public payments;
  public formGroup: UntypedFormGroup;
  public isEdit = false;
  public enableEditIndex;

  constructor(private apiService: CoreApiService,
              private commonDataService: CommonDataService,
              private fb: UntypedFormBuilder,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog
              ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getPaymentLimits();
    this.getForm();

  }

  getPaymentLimits() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.GET_PAYMENT_LIMIT).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.payments = data.ResponseObject;
        this.formGroup.get('WithdrawMaxCountPerDayPerCustomer').setValue(this.payments?.WithdrawMaxCountPerDayPerCustomer);
        this.formGroup.get('CashWithdrawMaxCountPerDayPerCustomer').setValue(this.payments?.CashWithdrawMaxCountPerDayPerCustomer);
      }
    });
  }

  savePayment() {
    if (!this.formGroup.valid) {
      return;
    }
    const partner = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, partner, true,
      Controllers.PARTNER, Methods.SET_PAYMENT_LIMIT).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.isEdit = false;
        this.getPaymentLimits();
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  getForm() {
    this.formGroup = this.fb.group({
      WithdrawMaxCountPerDayPerCustomer: [null],
      CashWithdrawMaxCountPerDayPerCustomer: [null],
      PartnerId: [+this.partnerId],
    });
  }

  async copyPartnerSettings() {
    const {CopySettingsComponent} = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

}
