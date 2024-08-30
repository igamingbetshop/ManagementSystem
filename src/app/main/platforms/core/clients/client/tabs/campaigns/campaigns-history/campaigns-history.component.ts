import { DatePipe } from '@angular/common';
import { Component, Injector, Input, OnInit, input } from '@angular/core';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';

@Component({
  selector: 'app-campaigns-history',
  templateUrl: './campaigns-history.component.html',
  styleUrls: ['./campaigns-history.component.scss']
})
export class CampaignsHistoryGridComponent extends BaseGridComponent implements OnInit {

  rowData = input<[]>();

  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: false,
    suppressMenu: true,
    minWidth: 50,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.setColDefs();
  }

  setColDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        suppressMenu: true,
        cellRenderer: params => {
          let a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
      }
    ];
  }

}
