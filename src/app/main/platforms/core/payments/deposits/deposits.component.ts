import { Component, OnInit, Injector } from '@angular/core';
import { BasePaymentComponent } from 'src/app/main/components/classes/base-payment-component';
import { DateAdapter } from "@angular/material/core";
import { GridMenuIds } from 'src/app/core/enums';
//import { syncPaginationWithBtn } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss']
})
export class DepositsComponent extends BasePaymentComponent implements OnInit {

  constructor(protected injector: Injector,
    public dateAdapter: DateAdapter<Date>,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.DEPOSITS;
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
   // syncPaginationWithBtn();
  }

}
