import {Component, OnInit} from '@angular/core';
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Controllers, Methods, ModalSizes} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public regExModel = {
    Uppercase: false,
    IsUppercaseRequired: false,
    Lowercase: false,
    IsLowercaseRequired: false,
    Numeric: false,
    IsDigitRequired: false,
    Symbol: false,
    IsSymbolRequired: false,
    MaxLength: 0,
    MinLength: 0
  };
  public partnerId;
  public partnerName;
  public states = [];
  public partnerEnvironments = [];
  public partners = [];
  public partnersVerificationTypeEnum = [];
  public formGroup: UntypedFormGroup;
  // public selected = {Id: 3, Name: 'environmentId'};
  public isEdit = false;
  public enableEditIndex;
  public adminSiteUrl = []
  public adminSiteUrlSelected;
  public siteUrl = [];
  public siteUrlSelected;

  constructor(private apiService: CoreApiService,
              private commonDataService: CommonDataService,
              private fb: UntypedFormBuilder,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog
              ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getStates();
    this.getPartnersVerificationTypeEnum();
    // this.getPartnerEnvironments();

    this.getForm();
  }

  getStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_USER_STATES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.states = data.ResponseObject;
        this.getPartners();
      }
    });
  }

  // getPartnerEnvironments() {
  //   this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
  //     Controllers.PARTNER, Methods.GET_PARTNER_ENVIRONMENTS).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //       this.partnerEnvironments = data.ResponseObject;
  //     }
  //   });
  // }

  getPartners() {
    this.apiService.apiPost(this.configService.getApiUrl, {Id: String(this.partnerId)}, true,
      Controllers.PARTNER, Methods.GET_PARTNERS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.partners = data.ResponseObject.Entities.map((obj) => {
          obj.StateName = this.states.find((item) => {
            return item.Id === obj.State;
          })?.Name;
          obj.VerificationTypeName = this.partnersVerificationTypeEnum.find((item) => {
            return item.Id === obj?.VerificationType;
          })?.Name;
          obj.AdminSiteUrl = obj.AdminSiteUrl.split(',');
          this.adminSiteUrl = obj.AdminSiteUrl;
          this.adminSiteUrlSelected = [...this.adminSiteUrl.keys()][0];
          obj.SiteUrl = obj.SiteUrl.split(',');
          this.siteUrl = obj.SiteUrl;
          this.siteUrlSelected = [...this.siteUrl.keys()][0];
          return obj;
        });
        this.formGroup.get('Id').setValue(this.partners[0].Id);
        this.formGroup.get('CurrencyId').setValue(this.partners[0].CurrencyId);
        this.formGroup.get('Name').setValue(this.partners[0].Name);
        this.formGroup.get('State').setValue(this.partners[0].State);
        this.formGroup.get('StateName').setValue(this.partners[0].StateName);
        this.formGroup.get('LastUpdateTime').setValue(this.partners[0].LastUpdateTime);
        this.formGroup.get('CreationTime').setValue(this.partners[0].CreationTime);
        this.formGroup.get('AdminSiteUrl').setValue(this.partners[0].AdminSiteUrl);
        this.formGroup.get('SiteUrl').setValue(this.partners[0].SiteUrl);
        this.formGroup.get('ClientMinAge').setValue(this.partners[0].ClientMinAge);
        this.formGroup.get('UnpaidWinValidPeriod').setValue(this.partners[0].UnpaidWinValidPeriod);
        this.formGroup.get('ClientSessionExpireTime').setValue(this.partners[0].ClientSessionExpireTime);
        this.formGroup.get('UnusedAmountWithdrawPercent').setValue(this.partners[0].UnusedAmountWithdrawPercent);
        this.formGroup.get('AccountingDayStartTime').setValue(this.partners[0].AccountingDayStartTime);
        this.formGroup.get('UserSessionExpireTime').setValue(this.partners[0].UserSessionExpireTime);
        this.formGroup.get('AutoApproveBetShopDepositMaxAmount').setValue(this.partners[0].AutoApproveBetShopDepositMaxAmount);
        this.formGroup.get('VerificationKeyActiveMinutes').setValue(this.partners[0].VerificationKeyActiveMinutes);
        this.formGroup.get('AutoApproveWithdrawMaxAmount').setValue(this.partners[0].AutoApproveWithdrawMaxAmount);
        this.formGroup.get('AutoConfirmWithdrawMaxAmount').setValue(this.partners[0].AutoConfirmWithdrawMaxAmount);
        this.formGroup.get('EmailVerificationCodeLength').setValue(this.partners[0].EmailVerificationCodeLength);
        this.formGroup.get('MobileVerificationCodeLength').setValue(this.partners[0].MobileVerificationCodeLength);
        this.formGroup.get('VerificationType').setValue(this.partners[0].VerificationType);
        this.regex.get('Uppercase').setValue(this.partners[0].PasswordRegExProperty.Uppercase);
        this.regex.get('IsUppercaseRequired').setValue(this.partners[0].PasswordRegExProperty.IsUppercaseRequired);
        this.regex.get('Lowercase').setValue(this.partners[0].PasswordRegExProperty.Lowercase);
        this.regex.get('IsLowercaseRequired').setValue(this.partners[0].PasswordRegExProperty.IsLowercaseRequired);
        this.regex.get('Numeric').setValue(this.partners[0].PasswordRegExProperty.Numeric);
        this.regex.get('IsDigitRequired').setValue(this.partners[0].PasswordRegExProperty.IsDigitRequired);
        this.regex.get('Symbol').setValue(this.partners[0].PasswordRegExProperty.Symbol);
        this.regex.get('IsSymbolRequired').setValue(this.partners[0].PasswordRegExProperty.IsSymbolRequired);
        this.regex.get('MaxLength').setValue(this.partners[0].PasswordRegExProperty.MaxLength);
        this.regex.get('MinLength').setValue(this.partners[0].PasswordRegExProperty.MinLength);
      }
    });
  }

  getPartnersVerificationTypeEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId, true,
      Controllers.ENUMERATION, Methods.PARTNERS_CLIENT_VERIFICATION_TYPE_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.partnersVerificationTypeEnum = data.ResponseObject;
      }
    });
  }

  getForm() {
    this.formGroup = this.fb.group({
      Id: [{value: null, disabled: true}],
      State: [null, [Validators.required]],
      StateName: [null],
      Name: [null, [Validators.required]],
      CurrencyId: [{value: null, disabled: true}],
      AdminSiteUrl: [null, [Validators.required]],
      CreationTime: [null],
      SiteUrl: [null, [Validators.required]],
      LastUpdateTime: [null],
      ClientMinAge: [null, [Validators.required]],
      UnpaidWinValidPeriod: [null, [Validators.required]],
      ClientSessionExpireTime: [null, [Validators.required]],
      UnusedAmountWithdrawPercent: [null, [Validators.required]],
      AccountingDayStartTime: [null, [Validators.required]],
      AutoConfirmWithdrawMaxAmount: [null, [Validators.required]],
      UserSessionExpireTime: [null, [Validators.required]],
      AutoApproveBetShopDepositMaxAmount: [null, [Validators.required]],
      VerificationKeyActiveMinutes: [null, [Validators.required]],
      AutoApproveWithdrawMaxAmount: [null, [Validators.required]],
      VerificationType: [null, [Validators.required]],
      MobileVerificationCodeLength: [null, [Validators.required]],
      EmailVerificationCodeLength: [null, [Validators.required]],
      PasswordRegExProperty: this.fb.group({
        Uppercase: [false],
        IsUppercaseRequired: [false],
        Lowercase: [false],
        IsLowercaseRequired: [false],
        Numeric: [false],
        IsDigitRequired: [false],
        Symbol: [false],
        IsSymbolRequired: [false],
        MaxLength: [0],
        MinLength: [0],
        PartnerId: +this.partnerId
      })
    });
  }

  saveRegex() {
    this.formGroup.get('PasswordRegExProperty').setValue(this.regex.value);
    this.apiService.apiPost(this.configService.getApiUrl, this.regex.value, true,
      Controllers.PARTNER, Methods.SAVE_PASSWORD_REG_EX).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        // this.isEdit = false;

      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  saveEditedPartner() {
    if (!this.formGroup.valid) {
      return;
    } else {
      const partner = this.formGroup.getRawValue();
      partner.AdminSiteUrl = partner.AdminSiteUrl.toString();
      partner.SiteUrl = partner.SiteUrl.toString();
      if (partner.AdminSiteUrl !== partner.SiteUrl) {
        this.apiService.apiPost(this.configService.getApiUrl, partner, true,
          Controllers.PARTNER, Methods.SAVE_PARTNER).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            partner.StateName = this.states.find((item) => {
              return item.Id === data.ResponseObject.State;
            }).Name;
            partner.VerificationTypeName = this.partnersVerificationTypeEnum.find((item) => {
              return item.Id === data.ResponseObject.VerificationType;
            }).Name;
            partner.AdminSiteUrl = partner.AdminSiteUrl.split(',');
            partner.SiteUrl = partner.SiteUrl.split(',');
            this.isEdit = false;
            this.getPartners();
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      }
    }
  }

  get regex() {
    return this.formGroup.get('PasswordRegExProperty') as UntypedFormGroup;
  }

  // uploadConfig() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {
  //       EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
  //     }, true,
  //     Controllers.CONTENT, Methods.UPLOAD_CONFIG).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // uploadMenus() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {
  //       EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
  //     }, true,
  //     Controllers.CONTENT, Methods.UPLOAD_MENUS).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // uploadStyles() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {
  //       EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
  //     }, true,
  //     Controllers.CONTENT, Methods.UPLOAD_STYLES).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // uploadTranslations() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {
  //       EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
  //     }, true,
  //     Controllers.CONTENT, Methods.UPLOAD_TRANSLATIONS).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // uploadPromotions() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {
  //       EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
  //     }, true,
  //     Controllers.CONTENT, Methods.UPLOAD_PROMOTIONS).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // uploadNews() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {
  //       EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
  //     }, true,
  //     Controllers.CONTENT, Methods.UPLOAD_NEWS).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // PurgeContentCache() {
  //   this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
  //     Controllers.PARTNER, Methods.PURGE_CONTENT_CACHE).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //     }
  //   });
  // }

  // editPartner(partnerId, index) {
  editPartner(index) {
    this.isEdit = true;
    this.enableEditIndex = index;
  }

  get errorControls() {
    return this.formGroup.controls;
  }

}
