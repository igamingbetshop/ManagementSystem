import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']
})
export class CompetitionComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main',
      route:'main'
    },
    {
      label:'Markets',
      route:'markets'
    },

  ];

  competitionId: number;

  constructor(
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.competitionId = this.activateRoute.snapshot.queryParams.competitionId;
  }

}
