import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main Info',
      route:'main'
    },
    {
      label:'Users',
      route:'users'
    },
  ];

  public roleId: number;

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.roleId = this.activateRoute.snapshot.queryParams.roleId;
  }

}
