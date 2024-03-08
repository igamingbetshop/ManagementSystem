import {DatePipe} from "@angular/common";
import {Component, Injector, OnInit, ViewChild} from '@angular/core';

import 'ag-grid-enterprise';
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";

import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {CoreApiService} from "../../services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {Controllers, GridRowModelTypes, Methods} from "../../../../../core/enums";
import { SnackBarHelper } from "src/app/core/helpers/snackbar.helper";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends BasePaginatedGridComponent implements OnInit {
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
      Controllers.PROVIDER, Methods.GET_NOTIFICATION_SERVICES).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      }
      else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
