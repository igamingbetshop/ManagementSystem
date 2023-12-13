import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-common',
  templateUrl: './view-common.component.html',
  styleUrls: ['./view-common.component.scss']
})
export class ViewCommonComponent implements OnInit {
  public id;
  public oldData;
  public newData;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.apiService.apiPost(this.configService.getApiUrl, this.id, true,
      Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.oldData = this.mapData(data.ResponseObject[0]);
        this.newData = this.mapData(data.ResponseObject[1]);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  mapData(res) {
    let data = JSON.parse(res);
    data.PartnerName = this.commonDataService.partners.find((item) => {
      return item.Id === data.PartnerId;
    }).Name;
    data.BonusCategorySettings = data.BonusCategorySettings.toString();
    data.BonusCountrySettings = data.BonusCountrySettings.toString();
    data.BonusCurrencySettings = data.BonusCurrencySettings.toString();
    data.BonusLanguageSettings = data.BonusLanguageSettings.toString();
    data.BonusPaymentSystemSettings = data.BonusPaymentSystemSettings.toString();
    return data;
  }

}
