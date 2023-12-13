import {Component, Injector, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes} from 'src/app/core/enums';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {MatSnackBar} from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import {MatDialog} from "@angular/material/dialog";
import {SessionModalComponent} from "./session-modal/session-modal.component";
import {CoreApiService} from "../../../../services/core-api.service";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';


@Component({
  selector: 'client-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowCount: number = 0;
  public clientId;
  public loginsFilter = {};
  public sessionStates = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public logOutType = [];
  public selectedRowId: number = 0;


  constructor(
    protected injector: Injector,
    private activateRoute: ActivatedRoute,
    private container: ViewContainerRef,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public dialog: MatDialog
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_SESSIONS;
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
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Bonuses.Source',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Source',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.LogoutDescription',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LogoutName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.LoginDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
          if (!dat) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.LogoutDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EndTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.EndTime, 'medium');
          if (!dat) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          // const iconName = params.data.Id === 300969 ? 'visibility' : 'lock';
          // const materialIcons = 'material-icons';

          return `<i class="material-icons">visibility</i>`

        },

        valueGetter: params => {
          let data = {};
          data['sessionId'] = params.data.Id;
          data['clientId'] = params.data.ClientId;
          data['sessionStates'] = this.sessionStates;
          data['logOutType'] = this.logOutType;
          return data;
        },
        sortable: false,
        filter: false,
        onCellClicked: this.onOpenSessionDetails['bind'](this)
      },
    ]
  }

  onOpenSessionDetails(data) {
    const dialogRef = this.dialog.open(SessionModalComponent, {
      width: ModalSizes.EXTRA_LARGE, data: {
        clientId: data.value.clientId, id: data.value.sessionId, sessionStates: data.value.sessionStates,
        logOutType: data.value.logOutType,
      }
    });
  }


  ngOnInit() {
    this.fetchSestionStates();
    this.fetchLogOutTypes();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.loginsFilter = {
      ClientId: this.clientId,
      TakeCount: 100,
      SkipCount: 0
    };
    this.getRows();

  }

  fetchLogOutTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_LOGOUT_TYPES_ENUM).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.logOutType = data.ResponseObject;

      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }

    })
  }

  fetchSestionStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_SESSION_STATES_ENUM).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.sessionStates = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
  }


  getRows() {
    this.apiService
    .apiPost(
      this.configService.getApiUrl,
      this.loginsFilter,
      true,
      Controllers.CLIENT,
      Methods.GET_CLIENT_LOGINS_PAGED_MODEL
    )
    .subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowCount = data.ResponseObject.Count;
        this.rowData = data.ResponseObject.Entities;
        this.rowData.forEach((session) => {
          let State = this.sessionStates.find((st) => {
            return st.Id == session.State;
          });
          if (State) {
            session["State"] = State.Name;
          }

          let logOut = this.logOutType.find((type) => {
            return type.Id == session.LogoutType;
          });
          if (logOut) {
            session["LogoutName"] = logOut.Name;
          }
        });


      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  onGridReady(params) {
    syncNestedColumnReset();
    this.selectedRowId = 0;
    super.onGridReady(params);


  }
}
