import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import {mergeMap, take} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { AffiliateStates, Controllers, Methods } from 'src/app/core/enums';
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

  public affiliate: any;
  public formGroup: UntypedFormGroup;
  public countries = [];
  public currencies: any[] = [];
  public genders: any[] = [];
  public languages: any[] = [];
  public partners: any[] = [];
  public isEdit = false;
  public states = [
    { Id: 1, Name: 'Active' },
    { Id: 2, Name: 'Suspended' },
    { Id: 3, Name: 'Disabled' },
    { Id: 4, Name: 'PendingForApproval' },
  ]
  private affiliateId: number;

  ngOnInit() {
    this.affiliateId = this.activateRoute.snapshot.queryParams.affiliateId;
    this.genders = this.commonDataService.genders;
    this.currencies = this.commonDataService.currencies;
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.createForm();
    this.mergeAffiliateApi();
  }

  constructor(
    public configService: ConfigService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
  ) {
    super(injector);
  }

  getAllCountries() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true, Controllers.REGION, Methods.GET_REGIONS).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.countries = data.ResponseObject;
      }
    });
  }

  mergeAffiliateApi() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true, Controllers.REGION, Methods.GET_REGIONS)
      .pipe(
        mergeMap(data => {
          if (data.ResponseCode === 0) {
            this.countries = data.ResponseObject;
          }
          return this.apiService.apiPost(this.configService.getApiUrl, this.affiliateId, true, Controllers.AFFILIATES, Methods.GET_AFFILIATE_BY_ID);
        }))
      .subscribe(data => {
        this.setAffiliateResponse(data);
      });
  }

  getAffiliate() {
    this.apiService.apiPost(this.configService.getApiUrl, this.affiliateId,
      true, Controllers.AFFILIATES, Methods.GET_AFFILIATE_BY_ID).pipe(take(1)).subscribe(data => {
      this.setAffiliateResponse(data);
    });
  }


  setAffiliateResponse(data: any) {
    if (data.ResponseCode === 0) {
      this.affiliate = data.ResponseObject;
      this.affiliate.GenderName = this.genders.find((gender) => gender.Id === this.affiliate.Gender)?.Name;
      this.affiliate.PartnerName = this.partners.find(p => p.Id === this.affiliate.PartnerId)?.Name;
      this.affiliate.StateName = AffiliateStates[this.affiliate.State];
      this.affiliate.RegionName = this.countries.find((country) => country.Id === this.affiliate.RegionId)?.Name;
      this.affiliate.LanguageId = this.languages.find((language) => language.Id === this.affiliate.LanguageId)?.Name;
      this.formGroup.patchValue(this.affiliate);
    } else {
      SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
    }
  }

  createForm() {
    this.formGroup = this.fb.group({
      Id: [{ value: null, disabled: true }],
      FirstName: [{ value: null, disabled: true }],
      LastName: [{ value: null, disabled: true }],
      Email: [{ value: null, disabled: true }],
      MobileNumber: [{ value: null, disabled: true }],
      UserName: [{ value: null, disabled: true }],
      NickName: [{ value: null, disabled: true }],
      Gender: [{ value: null, disabled: true }],
      State: [null, [Validators.required]],
      ClientId: [null],
      RegionId: [{ value: null, disabled: true }],
      LanguageId: [{ value: null, disabled: true }],
      PartnerId: [{ value: null, disabled: true }],
      CurrencyId: [{ value: null, disabled: true }],
      CreationTime: [{ value: null, disabled: true }],
      LastUpdateTime: [{ value: null, disabled: true }],
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
      true, Controllers.AFFILIATES, Methods.UPDATE_AFFILIATE).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'The Affiliate has been updated successfully', Type: "success" });
          this.isEdit = false;
          this.getAffiliate();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onMultipleSelect(value: number[], params): void {
    params.data.AccessObjectsIds = value;
  }

  onInputChange(value, params) {
    params.data.AccessObjectsIds = value;
  }

  saveRole(params) {
    const request = {
      Id: params.data.Id,
      IsForAll: params.data.IsForAll,
      Permissionid: params.data.Permissionid,
      RoleId: params.data.RoleId,
      UserId: this.affiliate?.Id,
      AccessObjects: params.data.AccessObjects,
      AccessObjectsIds: null,
    };

    if (typeof params.data.AccessObjectsIds === 'string') {
      request.AccessObjectsIds = params.data.AccessObjectsIds.split(',');
    } else {
      request.AccessObjectsIds = params.data.AccessObjectsIds;
    }

    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.PERMISSION, Methods.SAVE_ACCESS_OBJECTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {

          SnackBarHelper.show(this._snackBar, { Description: 'Role successfully updated', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  cancel() {
    this.isEdit = false;
    this.getAffiliate();
  }

}
