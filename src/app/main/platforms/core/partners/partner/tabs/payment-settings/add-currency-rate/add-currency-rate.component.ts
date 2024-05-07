import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-currency-rate',
  templateUrl: './add-currency-rate.component.html',
  styleUrls: ['./add-currency-rate.component.scss']
})
export class AddCurrencyRateComponent implements OnInit {
  formGroup: UntypedFormGroup;
  currencies = [];
  paymentSetting;
  isSendingReqest = false; 
  constructor(public dialogRef: MatDialogRef<AddCurrencyRateComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.currencies = this.commonDataService.currencies;
    this.paymentSetting = this.data.PaymentSettingId;
    this.formValues();
  }

  private formValues() {
    this.formGroup = this.fb.group({
      CurrencyId: [null],
      Rate: [null],
      PaymentSettingId: [null],
    })
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.formGroup.get('PaymentSettingId').setValue(this.paymentSetting);
    if (!this.formGroup.valid) {
      return;
    }
    this.isSendingReqest = true; 
    const setting = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PAYMENT, Methods.SAVE_PARTNER_PAYMENT_CURRENCY_RATE).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false; 
    });
  }

}
