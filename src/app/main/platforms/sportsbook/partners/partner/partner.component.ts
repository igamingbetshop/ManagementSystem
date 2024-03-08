import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MainInfo',
      route:'main'
    },
    {
      label:'Partners.WebSiteSettings',
      route:'web-site-settings'
    },
    {
      label:'Partners.Keys',
      route:'keys'
    },
    {
      label:'Common.Settings',
      route:'settings'
    },
  ];

  partnerId:number;

  constructor(private activateRoute:ActivatedRoute,) { }

  ngOnInit() {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
  }

}
