import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-withdraw-form',
  templateUrl: './add-withdraw-form.component.html',
  styleUrls: ['./add-withdraw-form.component.scss']
})
export class AddWithdrawFormComponent implements OnInit {
  formGroup: UntypedFormGroup;
  clientBanks = [];
  accounts = [];
  partnerId;
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<AddWithdrawFormComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.data.partnerId;
    // this.getPartnerBanks();
    this.formValues();
  }

  close() {
    this.dialogRef.close();
  }

  changeBank() {
    this.accounts = this.clientBanks.find(bank => bank.key == this.formGroup.get('BankName').value).value
  }

  private formValues() {
    this.formGroup = this.fb.group({
      PartnerId: [this.partnerId],
      BankName: [null],
      BankAccountNumber: [''],
      Amount: [null],
      ClientIdentifier: [''],
      Type: [1]
    })
  }

  submit() {
    if (!this.formGroup.valid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true;
    const setting = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PAYMENT, Methods.CREATE_PAYMENT_FORM_REQUEST).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false;
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  checkClientId() {
    let setting = {
      PartnerId: this.partnerId,
      ClientIdentifier: this.formGroup.get('ClientIdentifier').value
    }
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.CLIENT, Methods.GET_CLIENT_PAYMENT_ACCOUNT_DETAILS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.clientBanks = this.groupBy(data.ResponseObject, "BankName");
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  groupBy(value, field) {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({key, value: groupedObj[key]}));
  }

}
