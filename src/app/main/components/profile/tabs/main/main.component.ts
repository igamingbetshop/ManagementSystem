import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { take } from "rxjs/operators";
import { Controllers, Methods, ModalSizes } from 'src/app/core/enums';
import { ApiService, CommonDataService, ConfigService, LocalStorageService } from 'src/app/core/services';
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public id;
  public user;
  public genders: any[] = [];
  public currencies: any[] = [];
  public languages: any[] = [];
  public States: any[] = [];
  public types: any[] = [];
  public formGroup: UntypedFormGroup;
  public apiKeyString: string = '';
  public isEdit = false;
  public isSaveActive = false;
  public isTwoFactorEnabled: boolean;
  public oddsType:any = [];

  constructor(
    private configService: ConfigService,
    private apiService: ApiService,
    private localStorage: LocalStorageService,
    private router: Router,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    private translate: TranslateService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.oddsType = [
      { Id: 1, Name: this.translate.instant("Common.Decimal") },
      { Id: 2, Name: this.translate.instant("Common.Fractional") },
      { Id: 3, Name: this.translate.instant("Common.US") },
      { Id: 4, Name: this.translate.instant("Common.HK") },
      { Id: 5, Name: this.translate.instant("Common.Malay") },
      { Id: 6, Name: this.translate.instant("Common.Indo") }
    ];
  }

  ngOnInit() {
    this.common().pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.genders = data.ResponseObject.genders;
        this.currencies = data.ResponseObject.currencies;
        this.languages = data.ResponseObject.languages;
      }
    });

    this.userState().pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.States = data.ResponseObject;

      }
    });

    this.userType().pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.types = data.ResponseObject;
      }
    });
    this.isTwoFactorEnabled = this.localStorage.get('isTwoFactorEnabled');
    this.getProfileData();
    this.createForm();
  }

  getProfileData(): void {
    this.id = this.localStorage.get('user')?.UserId;
    this.api(this.id).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.user = data.ResponseObject;
        this.formGroup.patchValue(this.user);
        this.formValueChanged();
      }
    });
  }

  api(id) {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.GET_USER_BY_ID;
    request.Controller = Controllers.USER;
    request.RequestObject = id;
    return this.apiService.apiPost(url, request);
  }

  common() {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.GET_COMMON_DATA;
    request.Controller = Controllers.ENUMERATION;
    request.RequestObject = { ...request }
    return this.apiService.apiPost(url, request);
  }

  userState() {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.GET_USER_STATES_ENUM;
    request.Controller = Controllers.ENUMERATION;
    request.RequestObject = { ...request }
    return this.apiService.apiPost(url, request);
  }

  userType() {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.GET_USER_TYPES_ENUM;
    request.Controller = Controllers.ENUMERATION;
    request.RequestObject = { ...request }
    return this.apiService.apiPost(url, request);
  }

  private createForm() {

    this.formGroup = this.fb.group({
      Id: [{ value: null, disabled: true }],
      Type: [{ value: null, disabled: true }],
      State: [{ value: null, disabled: true }],
      UserName: [{ value: null, disabled: true }],
      FirstName: [null, [Validators.required]],
      Password: [null, [Validators.required, Validators.minLength(8)]],
      LastName: [null, [Validators.required]],
      Gender: [null, [Validators.required]],
      CurrencyId: [null, [Validators.required]],
      LanguageId: [null, [Validators.required]],
      OddsType: [null]
    });
  }

  formValueChanged(): void {
    this.formGroup.valueChanges.subscribe(data => {
      this.isSaveActive = true
    });
  }

  get errorControl() {
    return this.formGroup?.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    let formData = this.formGroup.getRawValue();
    const additionalData = { PartnerId: this.user.PartnerId, Email: this.user.Email, MobileNumber: this.user.MobileNumber, Phone: this.user.Phone };
    const requestBody = { ...additionalData, ...formData };

    this.saveUserData(requestBody).pipe(take(1)).subscribe(data => {

      if (data.ResponseCode === 0) {
        this.isSaveActive = false;
        this.isEdit = false;
        this.changeCurrencyId(data.ResponseObject);
        this.getProfileData();
        SnackBarHelper.show(this._snackBar, { Description: 'Profile successfully updated', Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  changeCurrencyId(data: { [key: string]: any }): void {
    const localStorageUser = this.localStorage.get('user');
    localStorageUser.CurrencyId = data.CurrencyId;
    this.localStorage.add('user', localStorageUser);
  }

  saveUserData(obj) {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.SAVE_USER;
    request.Controller = Controllers.USER;
    request.RequestObject = { ...request, ...obj };
    return this.apiService.apiPost(url, request);
  }

  onSubmitSApiKey() {
    this.saveApiKey().pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        // handle success response
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onRedirectToTwoFactor() {
    this.router.navigate(['main/profile/two-factor-authenticator/',
      { user: this.user.UserName }
    ])
  }

  async onOpenToTwoFactorConfirm() {
    const { TwoFactorConfirm } = await import('../../two-factor-confirm/two-factor-confirm.component');
    const dialogRef = this.dialog.open(TwoFactorConfirm, {
      width: ModalSizes.MEDIUM,
      data: { isDisable: true }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.localStorage.remove('isTwoFactorEnabled');
        this.localStorage.add('isTwoFactorEnabled', 'false');
        this.isTwoFactorEnabled = false;
      }
    });
  }

  saveApiKey() {
    let url = this.configService.getApiUrl + '/ApiRequest'
    let request: any = {};
    request.Method = Methods.SAVE_API_KEY;
    request.Controller = Controllers.USER;
    let filter = { ApiKey: this.apiKeyString, UserId: this.user.Id };
    request.RequestObject = { ...request, ...filter };
    this.apiKeyString = '';
    return this.apiService.apiPost(url, request);
  }

  getLanguageNameById(): string {
    return this.languages.find(el => el.Id === this.user?.LanguageId)?.Name;
  }

  getStateNameById(): string {
    return this.States.find(el => el.Id === this.user?.State)?.Name;
  }

  getTypeNameById(): string {
    return this.types.find(el => el.Id === this.user?.Type)?.Name;
  }

  getGenderNameById(): string {
    return this.genders.find(el => el.Id === this.user?.Gender)?.Name;
  }

  getOddTypeNameById(): string {
    return this.oddsType.find(el => el.Id === this.user?.OddsType)?.Name;
  }

}
