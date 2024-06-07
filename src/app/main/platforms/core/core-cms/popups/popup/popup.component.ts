import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
})
export class PopupComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main Info',
      route:'main'
    },
    {
      label:'Popup Statistics',
      route:'popup-statistics'
    },
  ];

  id:number;

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.queryParams.id;
  }

}
