import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";

import {take} from "rxjs/operators";
import {AgGridAngular} from "ag-grid-angular";
import {MatSnackBar} from "@angular/material/snack-bar";

import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {CoreApiService} from "../../services/core-api.service";
import 'ag-grid-enterprise';
import {Controllers, GridRowModelTypes, Methods, StatusNames} from "../../../../../core/enums";
import { ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';


@Component({
  selector: 'app-affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})


export class AffiliatesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public filteredData;



  constructor(private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              protected injector: Injector) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Bonuses.LastExecutionTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastExecutionTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        // cellRenderer: function (params) {
        //   let datePipe = new DatePipe("en-US");
        //   let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
        //   return `${dat}`;
        // },
      },
      {
        headerName: 'Bonuses.PeriodInHours',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PeriodInHours',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let key = params.value;
          return StatusNames[key]
        },
      },
    ]
  }

  ngOnInit() {
    this.getPaymentSystemTypes();
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  getPaymentSystemTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.PROVIDER, Methods.GET_AFFILIATE_PLATFORMS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }

    });
  }

}
