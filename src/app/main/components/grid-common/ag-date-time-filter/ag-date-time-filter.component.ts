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
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';


enum Operations {
  isGreater = 2,
  isLess = 4,
  isEuqal = 1,
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
    filterModels:
      [{
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
  public fromDate = new Date();
  public formattedDate = [];


  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  agInit(params: any): void {
    this.params = params;
    params.suppressFilterDropdown = true;
    const filterOptions = params.filterOptions;

    const displayKeysToKeep = [Operations.isGreater, Operations.isLess, Operations.isEuqal];

    const filteredOptions = filterOptions.filter(elem => displayKeysToKeep.includes(elem.displayKey));

    this.filterOptions =  filteredOptions.sort(customSort);

    this.filterData = params.filterData;
    this.filterType = params.filterType ? params.filterType : 'date';
    this.suppressAndOrCondition = params.suppressAndOrCondition ? params.suppressAndOrCondition : false;
    this.fillDefaultFilterData(0);
  }

  fillDefaultFilterData(conditionIndex: number) {
    this.filter.filterModels[conditionIndex].type = this.filterOptions[0]?.displayKey;
    this.filter.filterModels[conditionIndex].selectedType = this.filterOptions[0]?.displayName;
  }

  onDropdownOpen(opened: boolean, dropdownContent: any, i) {
  }

  isFilterActive(): boolean {
    return true;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return true;
  }

  getModel(): any {
    if (this.filter.filterModels[1]?.dateFrom && !this.suppressAndOrCondition) {
      return {
        condition1: { ...this.filter.filterModels[0] },
        condition2: { ... this.filter.filterModels[1] },
        filterType: this.filterType,
        operator: this.filter.IsAnd
      }
    } else if (this.filter.filterModels[0]?.dateFrom) {
      return { ...this.filter.filterModels[0], };
    } else
      return {ApiOperationTypeList: []}
  }
  setModel(model: any) {
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

  // onStartDateChange(event, conditionIndex: number) {
  //   const dateString = event;
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   const seconds = "00";
  //   const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  //   this.onDataChange(formattedDate, conditionIndex);

  //   if (conditionIndex) {
  //     this.filter.filterModels[1].dateFrom = formattedDate;
  //   } else {
  //     this.filter.filterModels[0].dateFrom = formattedDate;
  //   }

  // }

  onStartDateChange(event, conditionIndex: number) {
    const dateString = event;
    const date = new Date(dateString);

    // Get the current time zone offset in minutes
    const timeZoneOffsetMinutes = date.getTimezoneOffset();

    // Calculate the date and time in the current time zone
    const dateInCurrentTimeZone = new Date(date.getTime() + timeZoneOffsetMinutes * 60 * 1000);

    const year = dateInCurrentTimeZone.getFullYear();
    const month = String(dateInCurrentTimeZone.getMonth() + 1).padStart(2, "0");
    const day = String(dateInCurrentTimeZone.getDate()).padStart(2, "0");
    const hours = String(dateInCurrentTimeZone.getHours()).padStart(2, "0");
    const minutes = String(dateInCurrentTimeZone.getMinutes()).padStart(2, "0");
    const seconds = "00";
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.onDataChange(formattedDate, conditionIndex);

    if (conditionIndex) {
      this.filter.filterModels[1].dateFrom = formattedDate;
    } else {
      this.filter.filterModels[0].dateFrom = formattedDate;
    }
  }


}

function customSort(a, b) {
  const keyOrder = [2, 4, 1];
  return keyOrder.indexOf(a.displayKey) - keyOrder.indexOf(b.displayKey);
}
