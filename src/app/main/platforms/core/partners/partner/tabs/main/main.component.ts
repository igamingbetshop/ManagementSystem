import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

import { take } from "rxjs/operators";
import { CoreApiService } from "../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { Controllers, Methods } from "../../../../../../../core/enums";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public partnerId;
  public partnerName;
  public states = [];
  public partnerEnvironments = [];
  public partners = [];
  public partner;
  public partnersVerificationTypeEnum = [];
  public formGroup: UntypedFormGroup;
  public isEdit = false;
  public enableEditIndex;
  public adminSiteUrl = []
  public adminSiteUrlSelected;
  public siteUrl = [];
  public siteUrlSelected;

  isUppercaseRequired = false;
  isLowercaseRequired = false;
  isDigitRequired = false;
  isSymbolRequired = false;
  constructor(private apiService: CoreApiService,
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
    this.createForm();
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

  getPartners() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: String(this.partnerId) }, true,
      Controllers.PARTNER, Methods.GET_PARTNERS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.partner = data.ResponseObject.Entities[0];
          this.partner.StateName = this.states.find((item) => {
            return item.Id === this.partner.State;
          })?.Name;
          this.partner.VerificationTypeName = this.partnersVerificationTypeEnum.find((item) => {
            return item.Id === this.partner?.VerificationType;
          })?.Name;
          this.partner.AdminSiteUrl = this.partner.AdminSiteUrl.split(',');
          this.adminSiteUrl = this.partner.AdminSiteUrl;
          this.adminSiteUrlSelected = [...this.adminSiteUrl.keys()][0];
          this.partner.SiteUrl = this.partner.SiteUrl.split(',');
          this.siteUrl = this.partner.SiteUrl;
          this.siteUrlSelected = [...this.siteUrl.keys()][0];
          this.formGroup.patchValue(this.partner);
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

  createForm() {
    this.formGroup = this.fb.group({
      Id: [{ value: null, disabled: true }],
      State: [null, [Validators.required]],
      StateName: [null],
      Name: [null, [Validators.required]],
      CurrencyId: [{ value: null, disabled: true }],
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
    const data = this.regex.value;
    data.PartnerId = +this.partnerId;
    this.formGroup.get('PasswordRegExProperty').setValue(data);
    this.apiService.apiPost(this.configService.getApiUrl, data, true,
      Controllers.PARTNER, Methods.SAVE_PASSWORD_REG_EX).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.getPartners();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
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
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }

  get regex() {
    return this.formGroup.get('PasswordRegExProperty') as UntypedFormGroup;
  }

  setCheckbox(formControlName: string, changedFormControlName: string, validator: string) {
    const passwordRegExProperty = this.formGroup.get('PasswordRegExProperty');

    if (passwordRegExProperty.get(changedFormControlName).value === true) {
      const updatedValue = { ...passwordRegExProperty.value, [formControlName]: true };
      passwordRegExProperty.setValue(updatedValue);
      this[validator] = true;
    }  else {
      this[validator] = false;
    }
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

  onCancel() {
    this.isEdit = false;
    this.getPartners();
  }

}
