import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Sport.MainInfo',
      route:'main'
    },
    {
      label:'Sport.SportSettings',
      route:'sport-settings'
    },
    {
      label:'Clients.Bets',
      route:'bets'
    },
    {
      label:'Clients.Notes',
      route:'notes'
    },
  ];

  playerId:number;

  constructor(private activateRoute:ActivatedRoute) { }

  ngOnInit() {
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
  }

}
