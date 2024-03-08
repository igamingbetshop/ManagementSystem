import { Component, Inject } from '@angular/core';
import { AgFilterComponent } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { fromEvent, Subscription } from "rxjs";
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropdownDirective } from '../../../../core/directives/dropdown.directive';

@Component({
  selector: 'ag-selectable-filter',
  templateUrl: './ag-selectable-filter.component.html',
  styleUrls: ['./ag-selectable-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    DropdownDirective
  ]
})
export class AgSelectableFilter implements AgFilterComponent {
  public params: IFilterParams;
  public filterData: any;
  public filterOptions: any;
  public filter = { filterModels: [{ filter: null, type: null, selectedFilter: '', selectedType: '' }] };
  public subscriptionFirst: Subscription = new Subscription();
  public subscriptionSecond: Subscription = new Subscription();
  private prevFindIndex = -1;
  private suppressAndOrCondition: boolean | null;
  private filterType: number | string;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  agInit(params: any): void {
    this.params = params;
    params.suppressFilterDropdown = true;
    this.filterOptions = params.filterOptions;
    this.filterData = params.filterData;
    this.filterType = params.filterType ? params.filterType : 'number';
    this.suppressAndOrCondition = params.suppressAndOrCondition ? params.suppressAndOrCondition : false;
    this.fillDefaultFilterData(0);
  }

  fillDefaultFilterData(conditionIndex: number) {
    this.filter.filterModels[conditionIndex].type = this.filterOptions[0]?.displayKey;
    this.filter.filterModels[conditionIndex].selectedType = this.filterOptions[0]?.displayName;

  }

  onDropdownOpen(opened: boolean, dropdownContent: any, i) {
    if (opened && i == 0) {
      this.subscriptionFirst = this.subscribeDropdownContent(dropdownContent);
    } else if (!opened && i == 0) {
      this.subscriptionFirst.unsubscribe();
    }

  }


  subscribeDropdownContent(dropdownContent) {
    return fromEvent(this.document, 'keydown').subscribe((event: any) => {
      const key = event.key.toLowerCase();
      const dropdownData = Array.from(dropdownContent.children);
      const startWidthData = dropdownData.filter((list: HTMLElement) => list.textContent.toLowerCase().startsWith(key));
      const foundClassList = startWidthData.every((list: HTMLElement) => list.classList.contains('found'));

      if (foundClassList) {
        startWidthData.forEach((list: HTMLElement) => list.classList.remove('found'))
      }
      dropdownData.find((list: HTMLElement, index) => {
        const textContent = list.textContent.toLowerCase();
        if (textContent.startsWith(key) && !list.classList.contains('found')) {
          list.classList.add('key-find');
          list.classList.add('found');
          dropdownData[this.prevFindIndex] ? (dropdownData[this.prevFindIndex] as HTMLElement).classList.remove('key-find') : null;
          this.prevFindIndex = index;
          dropdownContent.scrollTo({ top: list.offsetHeight * index, behavior: 'smooth' });
          return true;
        }
      });
    });
  }

  isFilterActive(): boolean {
    return this.filter.filterModels[0]?.filter;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return true;
  }

  getModel(): any {
    return { filterType: this.filterType, filter: this.filter.filterModels[0].filter, type: this.filter.filterModels[0].type };
  }

  setModel(model: any) { }

  updateFilter() {
    if (this.isFilterActive()) {
      this.params.filterChangedCallback();
    }
    this.params.api.hidePopupMenu();
  }

  destroyFilter() {
    this.params.api.destroyFilter(this.params.column.getColId());
    this.params.api.hidePopupMenu();
  }

  onDataChange(displayKey: number, filterModel: { [key: string]: any }, conditionIndex: number) {
    const filterModels = this.filter.filterModels;
    filterModel.filter = displayKey;
  }

}
