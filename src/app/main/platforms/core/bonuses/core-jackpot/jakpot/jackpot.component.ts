import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { RouteTabItem } from 'src/app/core/interfaces';


@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss']
})

export class JackpotComponent implements OnInit {

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
      label:'Products.Products',
      route:'products'
    },

  ];

  ngOnInit() {
    this.commonID = this.activateRoute.snapshot.queryParams.commonId;
  }
}
