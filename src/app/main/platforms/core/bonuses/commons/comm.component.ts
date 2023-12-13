import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-common',
  templateUrl: './comm.component.html',
})
export class CommComponent implements OnInit {

  public commonID: number = 0;

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  tabs:RouteTabItem[] = [
    {
      label:'Segments.Details',
      route:'details'
    },
    {
      label:'Bonuses.TriggersGroup',
      route:'trigger-group'
    },
    {
      label:'Products.Products',
      route:'products'
    },

  ];

  ngOnInit() {
    this.commonID = this.activateRoute.snapshot.queryParams.commonId;
  }

}
