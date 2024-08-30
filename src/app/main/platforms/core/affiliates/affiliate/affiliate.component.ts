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
      label:'Sport.MainInfo',
      route:'main'
    },
    {
      label:'Agents.CommissionPlan',
      route:'commission-plan'
    },
    {
      label: 'Partners.Accounts',
      route: 'accounts'
    },
    {
      label: 'Common.Transactions',
      route: 'transactions'
    }
  ];

  affiliateId:number;

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.affiliateId = this.activateRoute.snapshot.queryParams.affiliateId;
  }

}
