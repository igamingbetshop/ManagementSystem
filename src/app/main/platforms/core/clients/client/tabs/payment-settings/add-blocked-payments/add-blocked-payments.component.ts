import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {ConfigService} from "../../../../../../../../core/services";
import {CoreApiService} from "../../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-blocked-payments',
  templateUrl: './add-blocked-payments.component.html',
  styleUrls: ['./add-blocked-payments.component.scss']
})
export class AddBlockedPaymentsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  blockedPayments = [];
  clientId: number;
  states: any;
  isSendingReqest = false;

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: { clientId: number, partnerId: number, currencyId: string},
              public dialogRef: MatDialogRef<AddBlockedPaymentsComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.formValues();
    this.featchPaymentSystems();
  }

  featchPaymentSystems() {
    const data = {
      Status: 1,
      CurrencyId: this.data.currencyId,
      Type: 2,
      PartnerId: this.data.partnerId,
    }
    this.apiService.apiPost(this.configService.getApiUrl, data, true, Controllers.PAYMENT,
      Methods.GET_PARTNER_PAYMENT_SETTINGS).pipe(take(1)).subscribe((data) => {
      this.blockedPayments = data.ResponseObject;
    })
  }

  formValues() {
    this.formGroup = this.fb.group({
      ClientId: [+this.clientId],
      PartnerPaymentSettingId: [null, [Validators.required]],
      State: [3],
    })
  }

  submit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
      Methods.SAVE_CLIENT_PAYMENT_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else{
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
        this.isSendingReqest = false;
    })
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }


}
