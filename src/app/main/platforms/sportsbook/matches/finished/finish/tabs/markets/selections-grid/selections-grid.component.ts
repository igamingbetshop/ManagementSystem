import { Component, Injector, OnInit, input } from '@angular/core';
import 'ag-grid-enterprise';
import { GridRowModelTypes, } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';

@Component({
  selector: 'app-selections-grid',
  templateUrl: './selections-grid.component.html',
  styleUrls: ['./selections-grid.component.scss'],

})
export class SelectionsGridComponent extends BaseGridComponent implements OnInit {
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = input<string>();;


  constructor(
    protected injector: Injector, 
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
        sortable: true,
        resizable: true,
        minWidth: 100,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: false,
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        sortable: true,
        resizable: true,
        editable: false,
        filter: false,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.BaseCoefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BaseCoefficient',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Common.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        resizable: true,
        sortable: true,
        editable: false,
        filter: false,
        cellEditor: 'numericEditor',

      },
      {
        headerName: 'Sport.LimitLeft',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LimitLeft',
        resizable: true,
        sortable: true,
        editable: false,
        filter: false,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.StatusName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Sport.ResettleStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ResettleStatus',
        resizable: true,
        sortable: true,
        filter: false,

      },
      {
        headerName: 'Sport.TotalBetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetAmount',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Sport.PossibleProfit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PossibleProfit',
        resizable: true,
        sortable: true,
        filter: false,
        cellRenderer: function (params) {
          let color = params.data.PossibleProfit < 0 ? 'red' : 'green';
          let value = params.data.PossibleProfit;
          let sign = params.data.PossibleProfit > 0 ? '+' : '';
          return `<div class="${color}">${sign}${value}</div>`;
        },
      },
      {
        headerName: 'Payments.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.TeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Info',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'market').split('?')[0];
          data.queryParams = { SelectionId: params.data.SelectionId };
          return data;
        },
        sortable: false
      },
    ];
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
  }
}
