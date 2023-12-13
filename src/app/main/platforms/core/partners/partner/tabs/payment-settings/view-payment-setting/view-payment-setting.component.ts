import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods, ModalSizes} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-payment-setting',
  templateUrl: './view-payment-setting.component.html',
  styleUrls: ['./view-payment-setting.component.scss']
})
export class ViewPaymentSettingComponent implements OnInit {
  public id;
  public paymentSystem;
  public paymentCurrencies = [];
  public statusName = [
    {Id: 1, Name: 'Active'},
    {Id: 3, Name: 'Hidden'},
    {Id: 2, Name: 'Inactive'},
  ];
  public typeNames = [
    {Id: 2, NickName: null, Name: "Deposit", Info: null},
    {Id: 1, NickName: null, Name: "Withdraw", Info: null}
  ];
  public countries = [];
  public editedPayment;
  public isEdit = false;
  public isEditCurrency = false;
  public formGroup: UntypedFormGroup;
  public enableEditIndex;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              private fb: UntypedFormBuilder,
              public dialog: MatDialog,
              public commonDataService: CommonDataService) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getAllCountries();
    this.getPartnerPaymentSystemId();
    this.getPartnerPaymentCurrency();
    this.getForm();
  }

  getPartnerPaymentCurrency() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.id, true,
      Controllers.PAYMENT, Methods.GET_PARTNER_PAYMENT_CURRENCY_RATES).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.paymentCurrencies = data.ResponseObject
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  getAllCountries() {
    this.apiService.apiPost(this.configService.getApiUrl, {TypeId: 5}, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.countries = data.ResponseObject;
      }
    });
  }

  editPaymentSystem() {
    this.isEdit = true;

  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    } else {
      const partner = this.formGroup.getRawValue();
      partner.Countries = this.paymentSystem.Countries;
      this.apiService.apiPost(this.configService.getApiUrl, partner, true,
        Controllers.PAYMENT, Methods.UPDATE_PARTNER_PAYMENT_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentSystem = data.ResponseObject;
          this.paymentSystem.PartnerName = this.commonDataService.partners.find((item => item.Id === this.paymentSystem.PartnerId))?.Name;
          this.paymentSystem.StateName = this.statusName.find((item => item.Id === this.paymentSystem.State))?.Name;
          this.isEdit = false;
          this.getPartnerPaymentSystemId()
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
    }
  }

  getPartnerPaymentSystemId() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.id, true,
      Controllers.PAYMENT, Methods.GET_PARTNER_PAYMENT_SETTING_BY_ID).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.paymentSystem = data.ResponseObject;
        this.paymentSystem.PartnerName = this.commonDataService.partners.find((item => item.Id === this.paymentSystem.PartnerId))?.Name;
        this.paymentSystem.StateName = this.statusName.find((item => item.Id === this.paymentSystem.State))?.Name;
        this.paymentSystem.TypeName = this.typeNames.find((item => item.Id === this.paymentSystem.Type))?.Name;
        this.formGroup.get('Id').setValue(this.paymentSystem?.Id);
        this.formGroup.get('State').setValue(this.paymentSystem?.State);
        this.formGroup.get('Commission').setValue(this.paymentSystem?.Commission);
        this.formGroup.get('FixedFee').setValue(this.paymentSystem?.FixedFee);
        this.formGroup.get('PartnerId').setValue(this.paymentSystem?.PartnerId);
        this.formGroup.get('PartnerName').setValue(this.paymentSystem?.PartnerName);
        this.formGroup.get('TypeName').setValue(this.paymentSystem?.TypeName);
        this.formGroup.get('Type').setValue(this.paymentSystem?.Type);
        this.formGroup.get('MinAmount').setValue(this.paymentSystem?.MinAmount);
        this.formGroup.get('MaxAmount').setValue(this.paymentSystem?.MaxAmount);
        this.formGroup.get('UserName').setValue(this.paymentSystem?.UserName);
        this.formGroup.get('Password').setValue(this.paymentSystem?.Password);
        this.formGroup.get('PaymentSystemName').setValue(this.paymentSystem?.PaymentSystemName);
        this.formGroup.get('PaymentSystemId').setValue(this.paymentSystem?.PaymentSystemId);
        this.formGroup.get('AllowMultipleClientsPerPaymentInfo').setValue(this.paymentSystem?.AllowMultipleClientsPerPaymentInfo);
        this.formGroup.get('AllowMultiplePaymentInfoes').setValue(this.paymentSystem?.AllowMultiplePaymentInfoes);
        this.formGroup.get('CurrencyId').setValue(this.paymentSystem?.CurrencyId);
        this.formGroup.get('LastUpdateTime').setValue(this.paymentSystem?.LastUpdateTime);
        this.formGroup.get('Priority').setValue(this.paymentSystem?.Priority);
        this.formGroup.get('Info').setValue(this.paymentSystem?.Info);
        this.formGroup.get('Countries').setValue(this.paymentSystem?.Countries);
        this.formGroup.get('OpenMode').setValue(this.paymentSystem?.OpenMode);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  getForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      State: [null, [Validators.required]],
      Commission: [null, [Validators.required]],
      FixedFee: [null],
      MinAmount: [null],
      MaxAmount: [null],
      UserName: [null],
      Password: [null],
      AllowMultipleClientsPerPaymentInfo: [false],
      AllowMultiplePaymentInfoes: [false],
      Info: [null],
      Priority: [null],
      Countries: [null],
      PartnerName: [null],
      PartnerId: [null],
      CurrencyId: [null],
      LastUpdateTime: [null],
      PaymentSystemName: [null],
      TypeName: [null],
      Type: [null],
      PaymentSystemId: [null],
      OpenMode: [null]
    });
  }

  get Countries() {
    return this.formGroup.controls["Countries"] as UntypedFormArray;
  }

  addNewAddressGroup() {
    const add = this.formGroup.get('Countries') as UntypedFormArray;
    add.push(this.fb.group({
      Id: [null],
      Name: [null]
    }))
  }

  submitCurrency(currencyItem) {
    let edited = {
      Id: currencyItem.Id,
      Rate: currencyItem.Rate,
      PaymentSettingId: currencyItem.PaymentSettingId,
      CurrencyId: currencyItem.CurrencyId
    }
    
    this.apiService.apiPost(this.configService.getApiUrl, edited, true,
      Controllers.PAYMENT, Methods.SAVE_PARTNER_PAYMENT_CURRENCY_RATE).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.paymentCurrencies = data.ResponseObject;
        this.isEditCurrency = false;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  editPaymentCurrency(currencyItem, index) {
    this.isEditCurrency = true;
    this.enableEditIndex = index;
  }

  async AddCurrencyRate() {
    const {AddCurrencyRateComponent} = await import('../add-currency-rate/add-currency-rate.component');
    const dialogRef = this.dialog.open(AddCurrencyRateComponent, {
      width: ModalSizes.MEDIUM,
      data: {PaymentSettingId: this.paymentSystem.Id}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPartnerPaymentCurrency();
      }
    });
  }

}