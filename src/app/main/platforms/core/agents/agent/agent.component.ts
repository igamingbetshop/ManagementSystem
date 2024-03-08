import {Component, OnInit} from '@angular/core';
import {RouteTabItem} from "../../../../../core/interfaces";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Controllers, Methods} from "../../../../../core/enums";
import {take} from "rxjs";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent implements OnInit {
  tabs: RouteTabItem[] = [
    {
      label: 'Sport.MainInfo',
      route: 'main'
    },
    {
      label: 'Sport.Downline',
      route: 'downline'
    }
  ]
  userId: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public translate: TranslateService,

  ) { }
  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.getUser();
  }

  getUser() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId,
      true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {

      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }
}
