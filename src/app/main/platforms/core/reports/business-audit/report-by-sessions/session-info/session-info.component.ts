import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, input } from '@angular/core';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss']
})
export class SessionInfoComponent extends BaseGridComponent implements OnInit {

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
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Language',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Bonuses.Source',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Source',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.LogoutDescription',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LogoutDescription',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Device',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Device',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: true,
        resizable: true,
        tooltipField: 'StartTime',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Clients.EndTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EndTime',
        sortable: true,
        resizable: true,
        tooltipField: 'EndTime',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.EndTime, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
    ]
  }

}
