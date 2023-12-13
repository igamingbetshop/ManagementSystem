import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
})
export class AnnouncementComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Main Info',
      route:'main'
    },
  ];

  announcementId:number;

  constructor(
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.announcementId = this.activateRoute.snapshot.queryParams.announcementId;
  }

}
