import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-correction-modal',
  templateUrl: './correction-modal.component.html',
  styleUrl: './correction-modal.component.scss'
})
export class CorrectionModalComponent implements OnInit {
  public currencies = [];
  public formGroup: UntypedFormGroup;
  public headerName: string;
  public showCurrency: boolean;
  public userId: string = '';
  public agentIds;
  public currencyId;

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
    this.agentIds = this.activateRoute.snapshot.queryParams.agentIds;
    this.headerName = this.data.headerName;
    this.showCurrency = this.data.showCurrency;
    this.currencyId = this.data?.account?.CurrencyId;
    this.formValues();
    this.getCurrencies();
  }

  formValues() {
    let requestObject;
    if (this.agentIds) {
      let agentIdArray = this.agentIds.split(',');
      let lastAgentId = agentIdArray[agentIdArray.length - 1];
      requestObject = lastAgentId;
    } else {
      requestObject = this.userId;
    }
    this.formGroup = this.fb.group({
      Amount: [null],
      CurrencyId: [this.currencyId],
      Info: [null],
      type: [this.headerName],
      UserId: [requestObject],
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
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

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
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  createCreditCorrection() {
    const requestBody = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.USER,
      Methods.CREATE_CREDIT_CORRECTION).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }
}
