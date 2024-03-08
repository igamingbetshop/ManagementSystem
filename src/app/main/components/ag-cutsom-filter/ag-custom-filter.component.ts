import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectModule} from "@angular/material/select";

import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {FilterService} from "../../../core/services/filter.service";

@Component({
  selector: 'ag-custom-filter',
  templateUrl: './ag-custom-filter.component.html',
  styleUrls: ['./ag-custom-filter.component.scss']
})
export class AgCustomFilterComponent implements OnInit {
  @Input() filter: { [key: string]: any };
  @Output() hideDropdown = new EventEmitter<boolean>();
  @Output() filterOperation = new EventEmitter<any>();
  public filterNumberOptions: { [key: string]: any };

  constructor(
    private filterService: FilterService,
    private _snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.checkInitialValue();
    this.filterNumberOptions = this.filterService.numberOptions;
  }

  checkInitialValue() {
    if(this.filter.FilterModel.ApiOperationTypeList.length === 1) {
      const hasValue = this.filter.FilterModel.ApiOperationTypeList.find(element => !!element.DecimalValue);

      if (hasValue) {
        this.filter.FilterModel.ApiOperationTypeList.push({IntValue: null, DecimalValue: null, OperationTypeId: 1});
      }
    }
  }

  onInputKey(event: KeyboardEvent, apiOperation: {[key: string]: any }, index: number): void {
    const inputValue = parseFloat((event.target as HTMLInputElement).value);
    apiOperation.IntValue = inputValue;
    apiOperation.DecimalValue = inputValue;
    const operationList = this.filter.FilterModel.ApiOperationTypeList;

    if(!!inputValue && operationList.length === 1) {
      operationList.push({IntValue: null, DecimalValue: null, OperationTypeId: 1});
    } else if (!inputValue && operationList.length === 2 && index === 0) {
      operationList.pop();
    }
  }

  resetFields() {
    this.filter.FilterModel.ApiOperationTypeList = [];
    this.filterOperation.emit(this.filter.FilterModel);
  }

  onSubmit() {
    this.filter.FilterModel.ApiOperationTypeList = this.filter.FilterModel.ApiOperationTypeList.filter(element => !!element.IntValue);
    this.filterOperation.emit(this.filter.FilterModel);
  }

  overlayDropdown(value: boolean) {
    this.hideDropdown.emit(value);
  }
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  exports: [
    AgCustomFilterComponent
  ],
  declarations: [AgCustomFilterComponent]
})
export class AgCustomFilterModule {}
