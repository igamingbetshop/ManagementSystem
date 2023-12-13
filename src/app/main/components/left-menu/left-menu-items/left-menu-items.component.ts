import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Category } from '../../../../core/models';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService, ConfigService } from '../../../../core/services';
import { debounceTime, take } from 'rxjs/operators';
import { Controllers, Methods } from '../../../../core/enums';
import { Subject, Subscription } from 'rxjs';
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
  public title: string;
  private url = this.configService.getApiUrl + '/ApiRequest';
  public disableApiCall = false;
  private routerSubscription: Subscription;
  public routerLinkUrl = '';
  public selectedCategory: string;
  public products = {
    "Id": 26,
    "Name": "Products.Products",
    "Icon": "hub",
    "ApiRequest": "products",
    "Route": "/main/platform/product-edit",
    "Path": "/1/26",
    "ParentId": 1,
    "Level": 2,
    "Pages": []
  }

  constructor(
    private router: Router,
    private configService: ConfigService,
    private apiService: ApiService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.title = this.getTitle();
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
    if (!category.Route) {
      return;
    }
    this.menuContacts.closeMenu();
  }

  private reloadPage(url: string): void {
    window.location.href = url;
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
    }

    return title;
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

}
