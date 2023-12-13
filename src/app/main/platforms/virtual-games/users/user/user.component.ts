import {Component, OnInit} from '@angular/core';
import {RouteTabItem} from "../../../../../core/interfaces";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  tabs: RouteTabItem[] = [
    {
      label: 'Main Info',
      route: 'main'
    },
    {
      label: 'Markets',
      route: 'markets'
    },
  ]
  userId:number;

  constructor(private activateRoute:ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
  }

}
