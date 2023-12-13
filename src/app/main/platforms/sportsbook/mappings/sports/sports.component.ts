import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
})
export class SportsComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MapSports',
      route:'map-sports'
    },
    {
      label:'Sport.MappedSports',
      route:'mapped-sports'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
