import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import {DatePipe} from "@angular/common";
import 'ag-grid-enterprise';
import {Controllers, GridRowModelTypes, Methods} from "../../../../../core/enums";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-payment-systems',
  templateUrl: './payment-systems.component.html',
  styleUrls: ['./payment-systems.component.scss']
})
export class PaymentSystemsComponent extends BasePaginatedGridComponent implements OnInit {
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
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
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
      Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      }

      setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 300);
    });
  }

}
