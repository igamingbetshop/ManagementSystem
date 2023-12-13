import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridRowModelTypes, Methods} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})
export class ClientSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public triggerId;
  public rowData;
  public columnDefs = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              public commonDataService: CommonDataService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              protected injector: Injector) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusId',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Username',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.SourceAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SourceAmount',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Common.DateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DateTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.DateTime, 'medium');
          return `${dat}`;
        },
      }
    ]
  }

  ngOnInit() {
    this.triggerId = this.activateRoute.snapshot.queryParams.triggerId;
    this.getTriggerSettingClients();
  }

  getTriggerSettingClients() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.triggerId, true,
      Controllers.BONUS, Methods.GET_TRIGGER_SETTING_CLIENTS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject
      }
    });
  }

}
