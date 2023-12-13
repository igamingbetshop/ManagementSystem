import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
})
export class FinishComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main',
      route:'main'
    },
    {
      label:'Markets',
      route:'markets'
    },
    {
      label:'Calculation',
      route:'calculation'
    },
    {
      label:'Bets',
      route:'bets'
    },
    {
      label:'Events',
      route:'events'
    },
    {
      label:'Bets Summary',
      route:'bets-summary'
    },
  ];

  finishId:number;

  constructor(
    private activateRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.finishId = this.activateRoute.snapshot.queryParams.finishId;
  }

}
