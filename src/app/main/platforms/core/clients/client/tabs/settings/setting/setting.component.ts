import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CoreApiService } from "../../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, Methods } from "../../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  public Id;
  public clientId: number;
  public history;
  public ObjectHistory;
  public oldData =
    {
      AMLProhibited: {},
      AMLVerified: {},
      JCJProhibited: {},
      CautionSuspension: {},
      SelfExcluded: {},
      SystemExcluded: {},
      TermsConditionsAcceptanceVersion: {},
      UnusedAmountWithdrawPercent: {},
      CasinoLayout: {},
      BlockedForInactivity: {},
      DocumentExpired: {},
      DocumentVerified: {},
      Excluded: {},
      IsAffiliateManager: {},
      MaxCredit: {},
      PasswordChangedDate: {},
      SessionLimit: {},
      Younger: {},
      PayoutLimit: {},
    };
  public newData =
    {
      AMLProhibited: {},
      AMLVerified: {},
      JCJProhibited: {},
      CautionSuspension: {},
      SelfExcluded: {},
      SystemExcluded: {},
      TermsConditionsAcceptanceVersion: {},
      UnusedAmountWithdrawPercent: {},
      CasinoLayout: {},
      BlockedForInactivity: {},
      DocumentExpired: {},
      DocumentVerified: {},
      Excluded: {},
      IsAffiliateManager: {},
      MaxCredit: {},
      PasswordChangedDate: {},
      SessionLimit: {},
      Younger: {},
      PayoutLimit: {},
    };

  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    protected injector: Injector,
    private router: Router,
    public configService: ConfigService,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.ObjectHistory = this.activateRoute.snapshot.queryParams.setting;
    this.apiService.apiPost(this.configService.getApiUrl, this.ObjectHistory, true,
      Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.mapData(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  mapData(res) {
    let oldData = JSON.parse(res[0]);
    let newData = JSON.parse(res[1]);

    for (let i = 0; i < oldData.length; i++) {
      if (oldData[i].Name == "SelfExcluded" && oldData[i].StringValue)
        oldData[i].StringValue = parseInt(oldData[i].StringValue);
      if (oldData[i].Name == "SystemExcluded" && oldData[i].StringValue)
        oldData[i].StringValue = parseInt(oldData[i].StringValue);

      this.oldData[oldData[i].Name] = oldData[i];

      if (oldData[i].StringValue == "" && newData.findIndex(x => x.Name == oldData[i].Name) == -1)
        this.newData[oldData[i].Name] = oldData[i];
    }

    for (let i = 0; i < newData.length; i++) {
      if (newData[i].Name == "SelfExcluded" && newData[i].StringValue)
        newData[i].StringValue = parseInt(newData[i].StringValue);
      if (newData[i].Name == "SystemExcluded" && newData[i].StringValue)
        newData[i].StringValue = parseInt(newData[i].StringValue);

      this.newData[newData[i].Name] = newData[i];

      if (newData[i].StringValue == "" && oldData.findIndex(x => x.Name == newData[i].Name) == -1)
        this.oldData[newData[i].Name] = newData[i];
    }
  }

  onNavigateTo() {

    this.router.navigate(['main/platform/clients/all-clients/client/settings/'],
      {queryParams: {"clientId": this.clientId}});
  }


}
