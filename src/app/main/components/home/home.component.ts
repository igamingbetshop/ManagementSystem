import { Component, OnDestroy, OnInit } from "@angular/core";
import { Categories, Category } from "../../../core/models";
import { categories } from "../../../core/constantes/categories.helper";
import { SearchService } from "../../../core/services/search.sevice";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public homeSections = JSON.parse(localStorage.getItem('adminMenu'));
  private searches: any;

  constructor(
    private searchService: SearchService,
  ) {
    this.searchService.searchData$.subscribe(searchValue => {
      this.searchSection(searchValue);
    });
  }

  ngOnInit() {
    this.searches = JSON.parse(JSON.stringify(this.homeSections));
  }

  searchSection(searchedValue: string): void {

    this.homeSections.forEach((elem, index) => {
      elem.Pages = this.searches[index].Pages.filter(field => this.findSectionName(field, searchedValue));
    })
  }

  findSectionName(field: Category, searchedValue: string) {
    const searchedPattern = new RegExp(searchedValue, 'gi');

    if (!field.Pages || field.Name.match(searchedPattern)) {
      return field.Name.match(searchedPattern);
    }

    return field.Pages.find(element => {
      return this.findSectionName(element, searchedValue);
    });
  }

  ngOnDestroy(): void {
    this.searchService.sendSearchValue("");
  }
}
