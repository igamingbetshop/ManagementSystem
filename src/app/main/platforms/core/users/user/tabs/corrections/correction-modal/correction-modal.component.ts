import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CoreApiService } from "../../../../../services/core-api.service";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Controllers, Methods } from "../../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { ConfigService } from "../../../../../../../../core/services";

@Component({
  selector: 'app-correction-modal',
  templateUrl: './correction-modal.component.html',
  styleUrls: ['./correction-modal.component.scss']
})
export class CorrectionModalComponent implements OnInit {
  currencies = [];
  formGroup: UntypedFormGroup;
  headerName: string;
  showCurrency: boolean;
  userId: string = '';
  currencyId;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<CorrectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: any, headerName: string, showCurrency: boolean },
    private apiService: CoreApiService,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.headerName = this.data.headerName;
    this.showCurrency = this.data.showCurrency;
    this.currencyId = this.data?.account?.CurrencyId;
    this.formValues();
    this.getCurrencies();
  }

  formValues() {
    this.formGroup = this.fb.group({
      Amount: [null],
      CurrencyId: [this.currencyId],
      Info: [null],
      type: [this.headerName],
      UserId: [this.userId],
    });
  }

  get errorControl() {
    return this.formGroup?.controls;
  }

  getCurrencies() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.CURRENCY, Methods.GET_CURRENCIES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.currencies = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true;
    if (this.headerName === 'Debit') {
      this.createDebitCorrection();
    } else {
      this.createCreditCorrection();
    }
  }

  createDebitCorrection() {
    const requestBody = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.USER,
      Methods.CREATE_DEBIT_CORRECTIONS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  createCreditCorrection() {
    const requestBody = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.USER,
      Methods.CREATE_CREDIT_CORRECTION).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

}
