import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
})
export class ActiveComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Match',
      route:'main'
    },
    {
      label:'Markets',
      route:'markets'
    },
    {
      label:'Profit',
      route:'profit'
    },
    {
      label:'Calculation',
      route:'calculation'
    },
    {
      label:'Events',
      route:'events'
    },
    {
      label:'Bets',
      route:'bets'
    },
    {
      label:'Bets Summary',
      route:'bets-summary'
    },
  ];

  MatchId:number;


  constructor(
    private activateRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.MatchId = this.activateRoute.snapshot.queryParams.MatchId;
  }

}
