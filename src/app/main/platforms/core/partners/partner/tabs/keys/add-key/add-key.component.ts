import {Component, Inject, OnInit} from '@angular/core';
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss']
})
export class AddKeyComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partnerId;
  paymentSystems = [];
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<AddKeyComponent>,
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
    this.getPaymentSystems();
    this.formValues();
  }

  getPaymentSystems() {
    this.apiService.apiPost(this.configService.getApiUrl, {IsActive: true}, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.paymentSystems = data.ResponseObject;
      }
    });
  }

  onSubmit() {
    if (!this.formGroup.valid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true; 
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PARTNER, Methods.SAVE_PARTNER_KEY).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
      this.isSendingReqest = false; 
    });
  }

  close() {
    this.dialogRef.close();
  }

  private formValues() {
    this.formGroup = this.fb.group({
      PaymentSystemId: [null],
      Name: [null],
      NumericValue: [null],
      StringValue: [null],
    })
  }
}
