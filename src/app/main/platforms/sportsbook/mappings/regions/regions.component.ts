import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-map-regions',
  templateUrl: './regions.component.html',
})
export class MapRegionsComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MapRegions',
      route:'map-regions'
    },
    {
      label:'Sport.MappedRegions',
      route:'mapped-regions'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
