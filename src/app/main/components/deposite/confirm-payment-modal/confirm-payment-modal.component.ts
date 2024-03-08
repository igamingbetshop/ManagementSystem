import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../platforms/core/services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../core/services";
import {Controllers, Methods} from "../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-confirm-payment-modal',
  templateUrl: './confirm-payment-modal.component.html',
  styleUrls: ['./confirm-payment-modal.component.scss']
})
export class ConfirmPaymentModalComponent{

  constructor(public dialogRef: MatDialogRef<ConfirmPaymentModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService) {
  }


  close() {
    this.dialogRef.close();
  }

  ok() {
    let value = {
      PaymentRequestId: this.data.PaymentRequestId,
      RequestType: this.data.RequestType,
      SendEmail: this.data.SendEmail,
      Parameters: '{}',
      Comment: this.data.Comment
    }

    if (value.RequestType === 3) {
      this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
        Methods.SET_TO_IN_PROCESS_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(true);
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    } else if (value.RequestType === 4) {
      this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
        Methods.SET_TO_FROZEN_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(true);
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    } else if (value.RequestType === 5) {
      this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
        Methods.SET_TO_WAITING_FOR_KYC_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(true);
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    } else if (value.RequestType === 2) {
      this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
        Methods.REJECT_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(true);
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    } else if (value.RequestType === 7) {
      this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
        Methods.ALLOW_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(true);
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    } else if (value.RequestType === 8) {
      this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PAYMENT,
        Methods.PAY_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          this.dialogRef.close(true);
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    }
  }

}
