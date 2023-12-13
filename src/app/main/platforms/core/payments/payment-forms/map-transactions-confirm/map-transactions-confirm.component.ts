import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../core/services";
import {UntypedFormBuilder} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-map-transactions-confirm',
  templateUrl: './map-transactions-confirm.component.html',
  styleUrls: ['./map-transactions-confirm.component.scss']
})
export class MapTransactionsConfirmComponent implements OnInit {
  public paymentSystemId;

  constructor(public dialogRef: MatDialogRef<MapTransactionsConfirmComponent>,
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
    let setting = {PaymentRequestId: this.paymentSystemId}
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PAYMENT, Methods.UPDATE_PAYMENT_ENTRY).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
