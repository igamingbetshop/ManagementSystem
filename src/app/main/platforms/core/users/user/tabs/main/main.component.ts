import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../../services/core-api.service';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {
  public userId: number;
  public user: any;
  public formGroup: UntypedFormGroup;
  public types: any[] = [];
  public states: any[] = [];
  public currencies: any[] = [];
  public genders: any[] = [];
  public languages: any[] = [];
  public partners: any[] = [];

  public blockedData;
  public getRoles = [];
  public editUserRoles = false;
  public enableEditRole = false;
  public roles = [];
  public rowSelection = 'multiple';
  public isEdit = false;
  public passRegEx;
  public editedRolePartner;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
  ) {
    super(injector);

  }

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.genders = this.commonDataService.genders;
    this.currencies = this.commonDataService.currencies;
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.initialStates();
    this.initialTypes();
    this.createForm();
  }

  public initialStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_USER_STATES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.states = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public initialTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_USER_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.types = data.ResponseObject;
          this.getUser();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getUser() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId,
      true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.user = data.ResponseObject;
          this.user.PartnerName = this.partners.find(p => p.Id === this.user.PartnerId)?.Name;
          this.user.StateName = this.states.find(p => p.Id === this.user.State)?.Name;
          this.user.GenderName = this.genders.find(p => p.Id === this.user.Gender)?.Name;
          this.user.TypeName = this.types.find(p => p.Id === this.user.Type)?.Name;
          this.user.LanguageName = this.languages.find(p => p.Id === this.user.LanguageId)?.Name;
          this.formGroup.patchValue(this.user);
          this.getPsswordRegex(this.user['PartnerId'], this.user['Type'])
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Id: [{ value: null, disabled: true }, [Validators.required]],
      Type: [null, [Validators.required]],
      State: [null, [Validators.required]],
      UserName: [null, [Validators.required]],
      FirstName: [null],
      Password: [null],
      LastName: [null],
      CurrencyId: [null, [Validators.required]],
      Email: [null],
      Gender: [null],
      LanguageId: [null, [Validators.required]],
      CorrectionMaxAmount: [null],
      CorrectionMaxAmountCurrency: [null],
    });
  }

  public getPsswordRegex(PartnerId, Type) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: PartnerId, Type: Type },
      true, Controllers.PARTNER, Methods.GET_USER_PASSWORD_REGEX).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.passRegEx = data.ResponseObject;
          let reg = new RegExp(this.passRegEx);
          this.formGroup.controls["Password"].setValidators([Validators.pattern(reg), Validators.minLength(8)]);
          this.formGroup.controls['Password'].updateValueAndValidity();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.USER, Methods.SAVE_USER).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'The User has been updated successfully', Type: "success" });
          this.isEdit = false;
          this.getUser();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  editUserRole() {
    this.editUserRoles = true;
  }

  cancel() {
    this.isEdit = false;
    this.getUser();
  }

}
