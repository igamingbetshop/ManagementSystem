import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../core/services";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods} from "../../../../../../../core/enums";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public clientId: number;
  public timeFilters = [
    {id: 0, Name: "24 hours", hours: 24},
    {id: 1, Name: "3 days", hours: 72},
    {id: 2, Name: "7 days", hours: 168},
    {id: 3, Name: "1 month", hours: 720}
  ];
  public days = 24;
  public selected = this.timeFilters[0].id;
  public selectedRow;
  public filteredByTime;

  constructor(private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              protected injector: Injector,
              private _snackBar: MatSnackBar) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_FRIENDS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Bonuses.BonusAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusAmount',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      }
    ]
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.changeTime(0);
  }

  onGridReady(params: any): void {
    syncNestedColumnReset();
    super.onGridReady(params);
  }

  changeTime(event) {
    this.selected = event;
    this.filteredByTime = this.timeFilters.find((value) => {
      return value.id === this.selected
    })
    const object = {ManagerId: this.clientId, Hours: this.filteredByTime.hours};
    this.apiService.apiPost(this.configService.getApiUrl, object, true,
      Controllers.CLIENT, Methods.GET_AFFILIATE_CLIENTS_OF_MANAGER).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
  }

}
