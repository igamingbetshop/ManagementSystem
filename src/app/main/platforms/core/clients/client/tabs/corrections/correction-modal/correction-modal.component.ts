import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import { OPERATIONS } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-correction-modal',
  templateUrl: './correction-modal.component.html',
  styleUrls: ['./correction-modal.component.scss']
})
export class CorrectionModalComponent implements OnInit {
  clientId: number;
  account;
  modalHeaderName;
  products = [];
  operations = OPERATIONS
  selectedLanguage;
  formGroup: UntypedFormGroup;
  headerName;
  currencyId;
  showSelectAccountType;
  accountTypes = [];
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<CorrectionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: any, headerName: any, showSelectAccountType: any },
    private apiService: CoreApiService,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private commonDataService: CommonDataService) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.account = this.data?.account;
    this.headerName = this.data.headerName;
    this.modalHeaderName = "Common." + this.headerName;
    this.showSelectAccountType = this.data.showSelectAccountType;
    this.formValues();
    this.currencyId = this.account?.CurrencyId;
    this.getProducts();
    this.getClientAccountTypes();
  }

  formValues() {
    this.formGroup = this.fb.group({
      AccountId: [this.account?.Id || null],
      AccountTypeId: [null],
      ClientId: [this.clientId],
      Amount: [null],
      CurrencyId: [this.currencyId],
      HideCurrency: [true],
      Info: [null],
      OperationTypeId: [null],
      showSelectAccountType: [this.showSelectAccountType],
      ProductId: [null],
      type: [this.headerName],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  getProducts() {
    this.apiService.apiPost(this.configService.getApiUrl, {ParentId: 1}, true,
      Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.products = data.ResponseObject.Entities;
      }
    });
  }

  getClientAccountTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_ACCOUNT_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.accountTypes = data.ResponseObject;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onsubmit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    } else {
      this.isSendingReqest = true; 
      const obj = this.formGroup.getRawValue();
      if (obj.OperationTypeId === null) {
          delete obj.OperationTypeId;
      }
      if (obj.ProductId === null) {
          delete obj.ProductId;
      }
      if (this.headerName == 'DebitToClient' || this.headerName == 'DebitToAccount') {
        if(this.headerName == 'DebitToClient') {
          delete obj.AccountId;
        }
        this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
          Methods.CREATE_DEBIT_CORRECTIONS).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.dialogRef.close(data.ResponseObject);
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
          this.isSendingReqest = false; 
        });
      } else {
        if(this.headerName == 'CreditFromClient') {
          delete obj.AccountId;
        }
        this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
          Methods.CREATE_CREDIT_CORRECTION).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.dialogRef.close(data.ResponseObject);
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      }
    }
  }

}
