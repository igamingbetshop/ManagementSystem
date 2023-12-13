import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-map-regions',
  templateUrl: './teams.component.html',
})
export class MapTeamsComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MapTeams',
      route:'map-teams'
    },
    {
      label:'Sport.MappedTeams',
      route:'mapped-teams'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
