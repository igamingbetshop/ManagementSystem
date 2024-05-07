import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CoreApiService } from "../../../../../services/core-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonDataService, ConfigService } from "../../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Controllers, Methods } from "../../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-payment-setting',
  templateUrl: './add-payment-setting.component.html',
  styleUrls: ['./add-payment-setting.component.scss']
})
export class AddPaymentSettingComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partnerId;
  paymentSystems = [];
  currencies = [];
  statusName = [
    { Id: 1, Name: 'Active' },
    { Id: 3, Name: 'Hidden' },
    { Id: 2, Name: 'Inactive' },
  ];
  typeNames = [
    { Id: 2, NickName: null, Name: "Deposit", Info: null },
    { Id: 1, NickName: null, Name: "Withdraw", Info: null }
  ];
  extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  partner;
  isSendingReqest = false; 

  constructor(public dialogRef: MatDialogRef<AddPaymentSettingComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.currencies = this.commonDataService.currencies;
    this.partner = this.commonDataService.partners.find((item => item.Id === +this.partnerId)).Name;
    this.getPaymentSystems();
    this.formValues();
  }

  close() {
    this.dialogRef.close();
  }

  getPaymentSystems() {
    this.apiService.apiPost(this.configService.getApiUrl, { IsActive: true }, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentSystems = data.ResponseObject;
        }
      });
  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.isSendingReqest = true; 
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PAYMENT, Methods.ADD_PARTNER_PAYMENT_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  private formValues() {
    this.formGroup = this.fb.group({
      PartnerId: [null],
      PaymentSystemId: [null],
      CurrencyId: [null],
      commission: [null],
      State: [null],
      Type: [null],
      UserName: [null],
      Password: [null],
      MinAmount: [null],
      MaxAmount: [null],
      ImageExtension: [null],
    })
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
