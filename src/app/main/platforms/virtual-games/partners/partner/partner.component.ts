import {Component, OnInit} from '@angular/core';
import {RouteTabItem} from "../../../../../core/interfaces";
import {ApiService} from "../../../../../core/services";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent implements OnInit {
  tabs: RouteTabItem[] = [
    {
      label: 'Main',
      route: 'main'
    },
    {
      label: 'Web Site Settings',
      route: 'web-site-settings'
    },
    {
      label: 'Keys',
      route: 'keys'
    },
  ]

  public partnerId;
  public partnerName;

  constructor(private apiService:ApiService,
              private activateRoute:ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
  }

}
