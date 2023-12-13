import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
})
export class AffiliateComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main Info',
      route:'main'
    },
    {
      label:'Commission Plan',
      route:'commission-plan'
    },
  ];

  affiliateId:number;

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.affiliateId = this.activateRoute.snapshot.queryParams.affiliateId;
  }

}
