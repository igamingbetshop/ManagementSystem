import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-providers-tab',
  templateUrl: './providers-tab.component.html',
})
export class ProvidersTabComponent implements OnInit {

  tabs: RouteTabItem[] = [
    {
      label: 'Main Info',
      route: 'main'
    },
    {
      label: 'Provider',
      route: 'provider'
    },
  ];

  providerId: number;

  constructor(
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.providerId = this.activateRoute.snapshot.queryParams.providerId;
  }

}
