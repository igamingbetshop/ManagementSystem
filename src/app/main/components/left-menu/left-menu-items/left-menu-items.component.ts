import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Category } from '../../../../core/models';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '../../../../core/services';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-left-menu-item',
  templateUrl: './left-menu-items.component.html',
  styleUrls: ['./left-menu-items.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeftMenuItemsComponent implements OnInit, OnDestroy {
  @ViewChild('menuContacts') menuContacts: MatMenuTrigger;
  @Input() categoryData: any;
  @Input() rootCategoryName: string;
  @Input() linkText: string;
  // public title: string;
  private url;
  public disableApiCall = false;
  private routerSubscription: Subscription;
  public routerLinkUrl = '';
  public selectedCategory: string;


  constructor(
    private router: Router,
    private configService: ConfigService,
    private route: Router
  ) {
    this.url = this.configService.getApiUrl + '/ApiRequest';
  }

  ngOnInit() {
    // this.title = this.getTitle();
    this.getRouterEventsUrl();
    this.getRouter();
  }

  getRouterEventsUrl(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectedCategory = '';
        this.routerLinkUrl = event.urlAfterRedirects;
        if (this.routerLinkUrl.includes('/' + this.rootCategoryName)) {
          this.selectedCategory = this.rootCategoryName;
        }
      }
    });
  }

  getRouter() {
    this.routerLinkUrl = this.router.url;
    if (this.router.url.includes('/' + this.rootCategoryName)) {
      this.selectedCategory = this.rootCategoryName;
    }
  }

  onClick(category): void {
    this.route.navigate([category.Route]);
    if (!category.Route) {
      return;
    }
    this.menuContacts.closeMenu();
  }

  getQueryParams(category: Category): { [key: string]: number | string } {
    let queryParams = {};
    if (category?.PartnerId) {
      queryParams = { BetId: category?.PartnerId, Name: category.Name };
    }
    return queryParams;
  }

  onMouseEnter(category: Category): void {

  }

  onMouseLeave(root: string) {
    if (root == 'root') {
      this.disableApiCall = true;
    }
  }

  getTitle(): string {
    let title = '';
    switch (this.rootCategoryName) {
      case 'CorePlatform':
        title = 'Home.CorePlatform';
        break;
      case 'Sportsbook':
        title = 'Home.Sportsbook';
        break;
      case 'VirtualGames':
        title = 'Home.VirtualGames';
        break;
      case 'SkillGames':
        title = 'Home.SkillGames';
        break;
      case 'Settings':
        title = 'Home.Settings';
        break;
      case 'Help':
        title = 'Home.Help';
        break;
      case 'PoolBetting':
        title = 'Home.PoolBetting';
        break;
    }
    return title;
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

}
