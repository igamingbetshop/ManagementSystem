import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  formGroup: UntypedFormGroup;
  clientId: number;
  bankNames = [];
  status;
  action;
  isSendingReqest = false; 

  constructor(public dialogRef: MatDialogRef<AddAccountComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.getClientPaymentInfoStates();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.action = this.data.action;
    this.FormValues();
    this.apiService.apiPost(this.configService.getApiUrl, {ClientIdentifier: this.clientId}, true,
      Controllers.PARTNER, Methods.GET_PARTNER_CUSTOMER_BANKS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.bankNames = data.ResponseObject;
      }
    });
  }

  getClientPaymentInfoStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_PAYMENT_INFO_STATES).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.status = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }


  submit() {
    if (!this.formGroup.valid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true; 
    const accountValue = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, accountValue, true, Controllers.CLIENT,
      Methods.UPDATE_CLIENT_PAYMENT_ACCOUNT).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false;
    });
  }

  private FormValues() {
    if (this.action === 'Add') {
      this.formGroup = this.fb.group({
        NickName: [null],
        BankName: [null],
        state: [null],
        Iban: [null],
        BankAccountNumber: [null],
        WalletNumber: [null],
        ClientId: [this.clientId],
        Type: [1]
      })
    } else if (this.action === 'Edit') {
      this.formGroup = this.fb.group({
        Id: [this.data.data.Id],
        NickName: [this.data.data.NickName],
        BankName: [this.data.data.BankName],
        state: [this.data.data.state],
        Iban: [this.data.data.Iban],
        BankAccountNumber: [this.data.data.BankAccountNumber],
        WalletNumber: [this.data.data.WalletNumber],
        ClientId: [this.clientId],
        Type: [1]
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
