import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Segments.Details',
      route:'details'
    },
    {
      label:'Clients.Clients',
      route:'clients'
    },
    {
      label:'Clients.Settings',
      route:'settings'
    },

  ];

  constructor() { }

  ngOnInit() {
  }

}
