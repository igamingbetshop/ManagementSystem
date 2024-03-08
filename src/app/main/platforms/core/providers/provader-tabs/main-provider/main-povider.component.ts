import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CoreApiService } from '../../../services/core-api.service';

@Component({
  selector: 'app-main-povider',
  templateUrl: './main-povider.component.html',
  styleUrls: ['./main-povider.component.scss']
})
export class MainProviderComponent implements OnInit {
  public providerId: number;
  public provider: any;
  public formGroup: UntypedFormGroup;
  public states: any[] = [];
  public currencies: any[] = [];
  public isEdit = false;
  public currencySetting: any;
  public currencesEntites = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.providerId = +this.activateRoute.snapshot.queryParams.providerId;
    this.currencies = this.commonDataService.currencies;
    this.getProviderById();
  }

  getProviderById() {
    this.apiService.apiPost(this.configService.getApiUrl, this.providerId,
      true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDER_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.provider = data.ResponseObject;
          this.currencySetting = this.provider.CurrencySetting[0];
          this.provider.CurrencySetting = this.currencySetting;
          this.formGroup.patchValue(this.provider);
          this.setCurrencesEntites();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      Name: [null],
      Type: [null],
      SessionExpireTime: [null],
      GameLaunchUrl: [null],
      CurrencySetting: this.fb.group({
        Ids: [null],
        CurrencyIds: [null],
        Type: [null],
      }),
      IsActive: [null],
    });
  }

  setCurrencesEntites() {
    this.currencesEntites.push(this.currencySetting?.CurrencyIds?.map(elem => {
      return " " +  this.currencies.find((item) => elem === item.Id).Name ;
    }))
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    // Create a copy of the form values
    const obj = { ...this.formGroup.value };

    // Set the CurrencySetting field explicitly
    obj.CurrencySetting = {
      Ids: obj.CurrencySetting.Ids,
      Names: obj.CurrencySetting.CurrencyIds,
      Type: obj.CurrencySetting.Type
    };

    this.apiService.apiPost(this.configService.getApiUrl,{ ...obj},
      true, Controllers.PRODUCT, Methods.SAVE_GAME_PROVIDER).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Updated successfully', Type: "success" });
          this.isEdit = false;
          this.currencesEntites = [];
          this.getProviderById();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  cancel() {
    this.isEdit = false;
  }

}
