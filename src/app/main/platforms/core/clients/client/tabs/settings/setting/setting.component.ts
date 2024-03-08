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
  public oldData;
  public newData;

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
    this.featchHistory();
  }

  featchHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, this.ObjectHistory, true,
      Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.oldData = JSON.parse(data.ResponseObject[0]);
          this.newData = JSON.parse(data.ResponseObject[1]);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  checkVerifications() {
    const oldVerificationServices = this.oldData?.VerificationServices || [];
    const newVerificationServices = this.newData?.VerificationServices || [];

    if (oldVerificationServices.length !== newVerificationServices.length) {
      return false;
    }

    for (let i = 0; i < oldVerificationServices.length; i++) {
      if (oldVerificationServices[i] !== newVerificationServices[i]) {
        return false;
      }
    }
      return true;
  }

  onNavigateTo() {
    this.router.navigate(['main/platform/clients/all-clients/client/settings/'],
      { queryParams: { "clientId": this.clientId } });
  }


}
