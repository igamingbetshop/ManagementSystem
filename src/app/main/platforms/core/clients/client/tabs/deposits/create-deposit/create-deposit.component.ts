import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { CoreApiService } from '../../../../../services/core-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-create-deposit',
  templateUrl: './create-deposit.component.html',
  styleUrls: ['./create-deposit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]

})
export class CreateDepositComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isSendingReqest = false; 
  paymentSystems = [];
  currencyId;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { clientId: number, partnerId: number, accountId: number, },
    public dialogRef: MatDialogRef<CreateDepositComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.currencyId = this.data['currencyId'];
    this.featchPaymentSystems()
    this.createForm();
    if (this.data) {
      this.formGroup.get('ClientId').setValue(this.data.clientId);
      this.formGroup.get('ClientId').disable();
    }
  }

  featchPaymentSystems() {
    const data = {
      Status: 1,
      CurrencyId: this.currencyId,
      Type: 2,
      PartnerId: this.data.partnerId,
    }
    this.apiService.apiPost(this.configService.getApiUrl, data, true, Controllers.PAYMENT,
      Methods.GET_PARTNER_PAYMENT_SETTINGS).pipe(take(1)).subscribe((data) => {
      this.paymentSystems = data.ResponseObject;
    })
  }

  public createForm() {
    this.formGroup = this.fb.group({
      ClientId: [null, [Validators.required]],
      PaymentSystemId: [null, [Validators.required]],
      Amount: [null, [Validators.required]],
      ExternalTransactionId: [null,],
      AccountId: [this.data.accountId],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true; 
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.PAYMENT, Methods.CREATE_MANUAL_DEPOSIT).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      });
  }

}
