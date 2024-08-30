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
import { Paging } from 'src/app/core/models';
import { take } from 'rxjs';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';

@Component({
  selector: 'client-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  rowCount: number = 0;
  clientId;
  clientData = {};
  sessionStates = [];
  rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  logOutType = [];
  selectedRowId: number = 0;
  fromDate = new Date();
  toDate = new Date();
  pageIdName =  '';
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
    agDateTimeFilter: AgDateTimeFilter
  };

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

  }

  onOpenSessionDetails(data) {
    const dialogRef = this.dialog.open(SessionModalComponent, {
      width: ModalSizes.XXXL, data: {
        clientId: data.value.clientId, id: data.value.sessionId, sessionStates: data.value.sessionStates,
        logOutType: data.value.logOutType,
      }
    });
  }


  ngOnInit() {
    this.fetchSestionStates();
    this.fetchLogOutTypes();
    this.setTime();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.pageIdName = `/ ${this.clientId} : ${this.translate.instant('Clients.Sessions')}`;
  }

  setColdefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        minWidth: 90,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressToolPanel: false,
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        minWidth: 90,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressToolPanel: false,      
      },
      {
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Bonuses.Source',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Source',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.LogoutDescription',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LogoutType',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.logOutType,
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.sessionStates,
        },
      },
      {
        headerName: 'Common.LoginDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
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
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
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
        onCellClicked: this.onOpenSessionDetails['bind'](this)
      },
    ]
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  fetchLogOutTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_LOGOUT_TYPES_ENUM).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.logOutType = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.setColdefs();

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

  onGridReady(params) {
    super.onGridReady(params);
    syncNestedColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        paging.ClientId = this.clientId;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging, true,
          Controllers.CLIENT, Methods.GET_CLIENT_LOGINS_PAGED_MODEL).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              this.rowData = data.ResponseObject.Entities;
              this.rowData?.forEach((session) => {
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
                  session["LogoutType"] = logOut.Name;
                }
              });
              params.success({ rowData: this.rowData || [], rowCount: data.ResponseObject.Count });

            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }
     
  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }
  
  onNavigateToClient() {
    this.router.navigate(["/main/platform/clients/all-clients"])
  }
}
