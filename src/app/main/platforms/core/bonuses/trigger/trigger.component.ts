import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-trigger',
  templateUrl: './trigger.component.html',
})
export class TriggerComponent implements OnInit {

  public triggerId: number = 0;

  tabs:RouteTabItem[] = [
    {
      label:'Details',
      route:'details'
    },
    {
      label:'Products',
      route:'products'
    },
    {
      label:'Client Settings',
      route:'client-settings'
    },


  ];

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.triggerId = this.activateRoute.snapshot.queryParams.triggerId;
  }

}
