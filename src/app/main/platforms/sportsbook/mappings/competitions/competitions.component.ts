import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-map-regions',
  templateUrl: './competitions.component.html',
})
export class MapCompetitionsComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MapCompetitions',
      route:'map-competitions'
    },
    {
      label:'Sport.MappedCompetitions',
      route:'mapped-competitions'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
