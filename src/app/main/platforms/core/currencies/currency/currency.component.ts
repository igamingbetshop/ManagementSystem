import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CoreApiService } from '../../services/core-api.service';
import { DatePipe } from '@angular/common';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-core-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;
  public currencyId:number;

  constructor(
    protected injector:Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private activateRoute:ActivatedRoute,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500'},
        filter: false,
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Payments.RateBefore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RateBefore',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Payments.RateAfter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RateAfter',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        filter: false,
        cellRenderer: function(params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime,'medium');
          return `${dat}`;
          },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        filter: false,
        cellRenderer: function(params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime,'medium');
          return `${dat}`;
          },
      },
    ]
   }

  ngOnInit() {
    this.currencyId = this.activateRoute.snapshot.queryParams.currencyId;
    this.gridStateName = 'currency-grid-state';
    this.getPage()
  }

  onGridReady(params)
  {
    super.onGridReady(params);

  }

  getPage(){
    this.apiService.apiPost(this.configService.getApiUrl, this.currencyId,
      true, Controllers.CURRENCY, Methods.GET_CURRENCY_RATES)
    .pipe(take(1))
    .subscribe(data => {
      if(data.ResponseCode === 0){
        this.rowData = data.ResponseObject;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
