import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-market-types',
  templateUrl: './market-types.component.html',
})
export class MapMarketTypesComponent implements OnInit {

  tabs: RouteTabItem[] = [
    {
      label:'Sport.MapMarketTypes',
      route:'map-market-types'
    },
    {
      label:'Sport.MappedMarketTypes',
      route:'mapped-market-types'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
