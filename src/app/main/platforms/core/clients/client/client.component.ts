import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { take } from "rxjs/operators";

import { RouteTabItem } from "../../../../../core/interfaces";
import { ConfigService } from "../../../../../core/services";
import { Controllers, Methods } from "../../../../../core/enums";
import { CoreApiService } from "../../services/core-api.service";
import { StateService } from "../../services/state.service";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})

export class ClientComponent implements OnInit {

  tabs: RouteTabItem[];
  public clientId: number;
  public clientInfo;
  public categoryTypes = [];
  public status = [];
  public tabsData = JSON.parse(localStorage.getItem('adminMenu'))[0];

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    private configService: ConfigService,
    private stateService: StateService,
  ) {
    this.stateService.clientState$.subscribe(enabled => {
      if (enabled) {
        this.getClientInfo();
      }
    });
  }

  ngOnInit() {
    this.tabsData = this.tabsData.Pages.find(item => item.Id === 4).Pages;
    this.setTabs(this.tabsData);
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getCategoryType();
    this.getStatus();
    this.getClientInfo(); 
  }


  getClientInfo() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId.toString(), true,
      Controllers.CLIENT, Methods.GET_CLIENT_INFO).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.clientInfo = data.ResponseObject;
          this.clientInfo.CategoryName = this.categoryTypes.find((item => item.Id === this.clientInfo.CategoryId))?.Name;
          this.clientInfo.StatusName = this.status.find((item => item.Id === this.clientInfo.Status))?.Name;
          this.clientInfo.Risk = this.clientInfo?.Risk > 100 ? 100 : this.clientInfo?.Risk;
        }
      });
  }

  getCategoryType() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_CATEGORIES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.categoryTypes = data.ResponseObject;
        }
      });
  }

  getStatus() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_STATES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.status = data.ResponseObject;
        }
      });
  }

  setTabs(backendData: any[]) {
    this.tabs = backendData.map(item => {
      const parts = item.Route.split('/');
      const lastPart = parts[parts.length - 1];

      return {
        label: item.Name,
        route: lastPart,
      };
    });
  }

}
