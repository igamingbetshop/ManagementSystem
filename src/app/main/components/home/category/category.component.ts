import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService, SidenavService } from "../../../../core/services";

import { Category, CategoryData } from "../../../../core/models";
import { SearchService } from "../../../../core/services/search.sevice";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CategoryComponent implements OnInit {
  @Input() categoryData: CategoryData;
  public categoryName: string;
  public title: string;
  private url;
  private dynamicMode = null;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private searchService: SearchService,
    private sidenavService: SidenavService,
  ) {
    this.searchService.showSearchContainer(true);
    this.sidenavService.sideNavState$.next(false);
    this.url = this.configService.getApiUrl + '/ApiRequest';
  }

  ngOnInit() {
    this.title = this.getTitle(this.categoryData);
    this.categoryName = this.categoryData.Name;
  }

  navigatePath(category: Category, element: HTMLElement, dropdown: HTMLElement | null = null): void {

    if (!!category['Route']) {
      let queryParams = this.getQueryParams(category);
      this.router.navigate([category['Route']], { queryParams: queryParams }).then(data => {
        this.searchService.showSearchContainer(false);
        this.sidenavService.sideNavState$.next(true);
      });
    } else if (dropdown instanceof HTMLElement) {
      element.classList.toggle('opened-dropdown');
      dropdown.classList.toggle('show-items');
    }
  }

  navigateEditPath(category: Category): void {
    let queryParams = this.getQueryParams(category);
    this.router.navigate([category['Route']], { queryParams: queryParams }).then(data => {
      this.searchService.showSearchContainer(false);
      this.sidenavService.sideNavState$.next(true);
    });
  }

  getQueryParams(category: Category): { [key: string]: number | string } {
    let queryParams = {};
    if (category.PartnerId) {
      queryParams = { BetId: category.PartnerId, Name: category.Name }
    }

    return queryParams;
  }

  menuOpened(category: Category, element: HTMLElement): void {

    element.classList.add('opened-menu');
  }

  menuClosed(element: HTMLElement) {
    element.classList.remove('opened-menu');
    this.dynamicMode = null;
  }



  getTitle(event): string {
    let title = '';
    switch (event['Name']) {
      case 'CorePlatform':
        title = "Home.CorePlatform";
        break;
      case 'Sportsbook':
        title = "Home.Sportsbook";
        break;
      case 'VirtualGames':
        title = "Home.VirtualGames";
        break;
      case 'SkillGames':
        title = "Home.SkillGames";
        break;
      case 'Settings':
        title = "Home.Settings";
        break;
      case 'Help':
        title = "Home.Help";
        break;
    }

    return title;
  }
}

