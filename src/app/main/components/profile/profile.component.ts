import { Component, OnInit } from '@angular/core';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main Info',
      route:'main'
    },
    {
      label:'Accounts History',
      route:'accounts-history'
    },

  ];

  constructor() { }

  ngOnInit(): void {
  }

}
