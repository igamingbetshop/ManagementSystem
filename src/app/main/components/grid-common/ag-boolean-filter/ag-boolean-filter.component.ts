import {Component} from '@angular/core';
import {AgFilterComponent} from "ag-grid-angular";
import {IDoesFilterPassParams, IFilterParams} from "ag-grid-community";

@Component({
  selector: 'ag-boolean-filter',
  templateUrl: './ag-boolean-filter.component.html',
  styleUrls: ['./ag-boolean-filter.component.scss']
})
export class AgBooleanFilterComponent implements AgFilterComponent {
  public path: string;

  constructor() {

  }

  params: IFilterParams;

  state: number = 0;

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.state === 1 || this.state === 2;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return true;
  }

  getModel(): any {
    return {filterType: 'boolean', filter: this.state, type: 1}
  }

  setModel(model: any) {
  }

  updateFilter() {
    if (this.state === 1 || this.state === 2) {
      this.params.filterChangedCallback();
    }
    this.params.api.hidePopupMenu();
  }

  destroyFilter() {
    this.params.api.destroyFilter(this.params.column.getColId());
    this.params.api.hidePopupMenu();
  }

}
