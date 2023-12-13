import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
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
  public formGroup: UntypedFormGroup;
  public blockedPayments = [];
  public clientId: number;

  constructor(public dialogRef: MatDialogRef<AddBlockedPaymentsComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.formValues();
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.PAYMENT,
      Methods.GET_PARTNER_PAYMENT_SETTINGS).pipe(take(1)).subscribe((data) => {
      this.blockedPayments = data.ResponseObject;
    })
  }

  formValues() {
    this.formGroup = this.fb.group({
      ClientId: [+this.clientId],
      PartnerPaymentSettingId: [null, [Validators.required]]
    })
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
      Methods.BLOCK_CLIENT_PAYMENT_SYSTEM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else{
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
    })
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }


}
