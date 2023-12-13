import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-map-result-types',
  templateUrl: './result-types.component.html',
})
export class MapResultTypesComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MapTypes',
      route:'map-result-types'
    },
    {
      label:'Sport.MappedTypes',
      route:'mapped-result-types'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
