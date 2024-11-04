import { Component, Inject } from '@angular/core';
import { AgFilterComponent } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { Subscription } from "rxjs";
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';
import { formatDateTime } from 'src/app/core/utils';

enum Operations {
  isGreater = 2,
  isLess = 4,
  isEqual = 1,
}

@Component({
  selector: 'ag-date-time-filter',
  templateUrl: './ag-date-time-filter.component.html',
  styleUrls: ['./ag-date-time-filter.component.scss'],
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
export class AgDateTimeFilter implements AgFilterComponent {
  public params: IFilterParams;
  public filterData: any;
  public filterOptions: any;
  public filter = {
    filterModels: [{
      dateFrom: '',
      dateTo: null,
      filterType: "date",
      type: '',
      selectedType: ''
    }],
    IsAnd: 'AND'
  };

  public subscriptionFirst: Subscription = new Subscription();
  public subscriptionSecond: Subscription = new Subscription();
  private suppressAndOrCondition: boolean | null;
  private filterType: "date";
  public formattedDate: string[] = [''];

  constructor(@Inject(DOCUMENT) private document: Document) { }

  agInit(params: any): void {
    this.params = params;
    params.suppressFilterDropdown = true;
    const filterOptions = params.filterOptions;

    const displayKeysToKeep = [Operations.isGreater, Operations.isLess, Operations.isEqual];
    this.filterOptions = filterOptions.filter(elem => displayKeysToKeep.includes(elem.displayKey)).sort(customSort);

    this.filterData = params.filterData;
    this.filterType = params.filterType ? params.filterType : 'date';
    this.suppressAndOrCondition = params.suppressAndOrCondition ? params.suppressAndOrCondition : false;
    this.fillDefaultFilterData(0);
  }

  fillDefaultFilterData(conditionIndex: number) {
    this.filter.filterModels[conditionIndex].type = this.filterOptions[0]?.displayKey;
    this.filter.filterModels[conditionIndex].selectedType = this.filterOptions[0]?.displayName;
    this.formattedDate[conditionIndex] = this.filter.filterModels[conditionIndex].dateFrom;
  }

  isFilterActive(): boolean {
    return !!this.filter.filterModels[0].dateFrom;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // Implement your filter logic here
    return true;
  }

  getModel(): any {
    if (this.filter.filterModels[1]?.dateFrom && !this.suppressAndOrCondition) {
      return {
        condition1: { ...this.filter.filterModels[0] },
        condition2: { ...this.filter.filterModels[1] },
        filterType: this.filterType,
        operator: this.filter.IsAnd
      }
    } else if (this.filter.filterModels[0]?.dateFrom) {
      return { ...this.filter.filterModels[0] };
    } else {
      return { ApiOperationTypeList: [] };
    }
  }

  setModel(model: any) {
    // Implement your set model logic here
  }

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

  onDataChange(formattedDate: any, conditionIndex?: number) {
    const filterModels = this.filter.filterModels;
    if (conditionIndex === 0 && filterModels.length < 2) {
      filterModels.push({
        dateFrom: '',
        dateTo: null,
        filterType: "date",
        type: '',
        selectedType: ''
      });
      this.fillDefaultFilterData(1);
    }
  }

  onStartDateChange(event: any, conditionIndex: number) {
    const date = new Date(event);
    const formattedDate = formatDateTime(date);
    this.onDataChange(formattedDate, conditionIndex);

    if (conditionIndex) {
      this.filter.filterModels[1].dateFrom = formattedDate;
    } else {
      this.filter.filterModels[0].dateFrom = formattedDate;
    }

    this.formattedDate[conditionIndex] = formattedDate;
  }

  onDropdownOpen(opened: boolean, dropdownContent: any, index: number) {
    // console.log(`Dropdown ${index} opened: ${opened}`);
  }
}

function customSort(a, b) {
  const keyOrder = [2, 4, 1];
  return keyOrder.indexOf(a.displayKey) - keyOrder.indexOf(b.displayKey);
}