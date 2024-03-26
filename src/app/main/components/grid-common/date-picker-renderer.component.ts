import {Component, NgModule} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";


@Component({
  selector: 'app-date-picker-renderer',
  template: `
    <div style="width: 70%">
      <input
        matInput
        [matDatepicker]="picker"
        [(ngModel)]="params.value"
        (dateChange)="onDateChanged($event, $event)"/>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </div>
  `
})
export class DatePickerRendererComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  getValue = (params) => {
    return params.data;
  };

  refresh(params?: any): boolean {
    return true;
  }

  onDateChanged(event, param) {
    let date = event.value;
    if (this.params.onchange instanceof Function) {

      this.params.onchange(this.params.data, event, this.params);

    }

  }
  // onDateChanged = event => {
  //   let date = event.value;
  //   if (this.params.onchange instanceof Function) {
  //
  //     this.params.onchange(this.params.data, event, this.params);
  //
  //   }
  //
  // }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  declarations: [DatePickerRendererComponent]
})
export class DatePickerRendererModule {

}
