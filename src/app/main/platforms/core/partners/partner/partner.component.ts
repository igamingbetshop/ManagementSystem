import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RouteTabItem } from "../../../../../core/interfaces";
import { ApiService, ConfigService } from "../../../../../core/services";

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent implements OnInit {
  tabs: RouteTabItem[] = [];
  public partnerId;
  public partnerName;
  public tabsData = JSON.parse(localStorage.getItem('adminMenu'))[0].Pages.find(item => item.Id === 18).Pages;


  constructor(private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.setTabs(this.tabsData);
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
