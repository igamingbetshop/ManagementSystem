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
      label: 'Agents.MainInfo',
      route: 'main'
    },
    {
      label: 'Products.Products',
      route: 'product',
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
