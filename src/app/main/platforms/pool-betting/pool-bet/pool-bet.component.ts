import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RouteTabItem} from 'src/app/core/interfaces';

@Component({
  selector: 'app-pool-bet',
  template: `
    <nav mat-tab-nav-bar class="detail-nav-tabs">
      <a mat-tab-link *ngFor="let tab of tabs" [routerLink]="tab.route" routerLinkActive [queryParamsHandling]="'merge'" #rla="routerLinkActive" [active]="rla.isActive">{{tab.label}}</a>
    </nav>
    <router-outlet></router-outlet>`
})
export class PoolBetComponent {

  public tabs: RouteTabItem[] = [
    {
      label: 'Partners.Main',
      route: 'main'
    },
    {
      label: 'Sport.Matches',
      route: 'matches'
    },
    {
      label: 'Notifications.Tickets',
      route: 'tickets'
    },
  ];

  constructor(
  ) {
  }

}
