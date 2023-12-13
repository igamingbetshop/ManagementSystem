import {Component, OnInit} from '@angular/core';
import {RouteTabItem} from "../../../../../core/interfaces";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  tabs: RouteTabItem[] = [
    {
      label: 'Main Info',
      route: 'main'
    },
  ];

  playerId:number;

  constructor(private activateRoute:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
  }

}
