import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-map-phases',
  templateUrl: './phases.component.html',
})
export class MapPhasesComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MapPhases',
      route:'map-phases'
    },
    {
      label:'Sport.MappedPhases',
      route:'mapped-phases'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
