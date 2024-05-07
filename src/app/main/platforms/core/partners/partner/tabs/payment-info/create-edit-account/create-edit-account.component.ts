import {Component, Inject, OnInit} from '@angular/core';
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-edit-account',
  templateUrl: './create-edit-account.component.html',
  styleUrls: ['./create-edit-account.component.scss']
})
export class CreateEditAccountComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public action;
  public partnerId;
  public paymentSystems = [];
  public currencies = [];
  public bankInfoTypes = [
    {Id: 1, Name: "Bank For Company"},
    {Id: 2, Name: "Bank For Customer"}
  ];
  isSendingReqest = false; 

  constructor(public dialogRef: MatDialogRef<CreateEditAccountComponent>,
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
    this.action = this.data.action;
    this.currencies = this.commonDataService.currencies;
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

  private formValues() {
    if (this.action === 'Add') {
      this.formGroup = this.fb.group({
        BankName: [null],
        BranchName: [null],
        BankCode: [null],
        IBAN: [null],
        Accounts: [this.fb.array([])],
        OwnerName: [null],
        Order: [null],
        PartnerId: [+this.partnerId],
        Type: [null],
        Active: [false],
        CurrencyId: [null],
        PaymentSystemId: [null],
        AccountsStr: [null]
      })
    } else if (this.action === 'Edit') {
      this.formGroup = this.fb.group({
        Id: [this.data.data.Id],
        BankName: [this.data.data.BankName],
        BranchName: [this.data.data.BranchName],
        BankCode: [this.data.data.BankCode],
        IBAN: [this.data.data.IBAN],
        // Accounts: [this.data.data.Accounts],
        Accounts: [this.fb.array([this.data.data.Accounts])],
        OwnerName: [this.data.data.OwnerName],
        PartnerId: [+this.partnerId],
        AccountsStr: [this.data.data.Accounts.toString()],
        Type: [this.data.data.Type],
        Order: [this.data.data.Order],
        Active: [this.data.data.Active],
        CurrencyId: [this.data.data.CurrencyId],
        PaymentSystemId: [this.data.data.PaymentSystemId],
      })
    }
  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.isSendingReqest = true; 
    const accountValue = this.formGroup.getRawValue();
    if(this.formGroup.controls.AccountsStr.value)
      accountValue.Accounts = this.formGroup.controls.AccountsStr.value.split(',');
    else
      accountValue.Accounts = null;

    this.apiService.apiPost(this.configService.getApiUrl, accountValue, true,
      Controllers.PARTNER, Methods.UPDATE_PARTNER_BANK_INFO).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
