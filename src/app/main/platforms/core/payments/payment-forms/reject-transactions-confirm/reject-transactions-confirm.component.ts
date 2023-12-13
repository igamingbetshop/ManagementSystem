import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {set} from "ag-grid-community/dist/lib/utils/object";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-reject-transactions-confirm',
  templateUrl: './reject-transactions-confirm.component.html',
  styleUrls: ['./reject-transactions-confirm.component.scss']
})
export class RejectTransactionsConfirmComponent implements OnInit {
  public paymentSystemId;
  public comment;

  constructor(public dialogRef: MatDialogRef<RejectTransactionsConfirmComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.paymentSystemId = this.data.paymentRequestId;
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    let setting = {PaymentRequestId: this.paymentSystemId, Comment: this.comment}
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PAYMENT, Methods.REJECT_PAYMENT_REQUEST).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
