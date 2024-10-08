import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-market-type',
  templateUrl: './market-type.component.html',
  styleUrls: ['./market-type.component.scss']
})
export class MarketTypeComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MainInfo',
      route:'main'
    },
    {
      label:'Sport.Selections',
      route:'selections'
    },
  ];

  marketTypeId:number;

  constructor(private activateRoute:ActivatedRoute) { 
    console.log('MarketTypeComponent');
    
  }

  ngOnInit() {
    this.marketTypeId = this.activateRoute.snapshot.queryParams.marketTypeId;
  }

}
