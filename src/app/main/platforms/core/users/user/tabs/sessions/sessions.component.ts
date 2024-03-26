import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";

import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {MatSnackBar} from "@angular/material/snack-bar";
import {take} from "rxjs/operators";

import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncColumnSelectPanel, syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { ConfigService, CommonDataService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../../../services/core-api.service';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { ActivatedRoute } from '@angular/router';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  filteredData;
  selectedItem = 'today';
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };
  deviceTypes = [
    {Id: 1, Name: 'Desktop'},
    {Id: 2, Name: 'Mobile'},
    {Id: 3, Name: 'Wap'}
  ];
  reasons = [];
  partnerId;
  show = true;
  states = ACTIVITY_STATUSES;
  userId;
  pageIdName: string;
  constructor(
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              private activateRoute: ActivatedRoute,
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
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
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
          filterOptions: this.filterService.textOptions
        },
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
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Reason',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LogoutType',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StateName',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.states,
        },
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
          let dat = datePipe.transform(params.data.EndTime, 'medium') || '';
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
    ]
  }

  ngOnInit(): void {
    this.userId = +this.activateRoute.snapshot.queryParams.userId;
    this.setTime();
    this.pageIdName = `/ ${this.userId} : ${this.translate.instant('Clients.Sessions')}`;
    this.getReason();
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  getReason() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_LOGOUT_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.reasons = data.ResponseObject;
      }
    });
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onGridReady(params) {
    super.onGridReady(params);
    // syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();

          paging.PartnerId = this.partnerId;
          paging.SkipCount = this.paginationPage - 1;
          paging.TakeCount = this.cacheBlockSize;
          paging.FromDate = this.fromDate;
          paging.ToDate = this.toDate;
          // paging.UserId = this.userId;
        this.changeFilerName(params.request.filterModel, ['StateName'], ['state']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        paging.UserIds ={
          "ApiOperationTypeList": [
              {
                  "OperationTypeId": 1,
                  "DecimalValue": this.userId,
                  "IntValue": this.userId
              }
          ],
          "IsAnd": true
      }
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_USER_SESSIONS).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.Entities.map((items) => {
              items.StateName = this.states.find((item => item.Id === items.State))?.Name;
              items.LogoutType = this.reasons.find((item => item.Id === items.LogoutType))?.Name;
              return items;
            });
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      },
    };
  }

  // exportToCsv() {
  //   this.apiService.apiPost(this.configService.getApiUrl, {...this.filteredData, adminMenuId: this.adminMenuId}, true,
  //     Controllers.REPORT, Methods.EXPORT_CLIENT_SESSIONS).pipe(take(1)).subscribe((data) => {
  //     if (data.ResponseCode === 0) {
  //       var iframe = document.createElement("iframe");
  //       iframe.setAttribute("src", this.configService.defaultOptions.WebApiUrl + '/' + data.ResponseObject.ExportedFilePath);
  //       iframe.setAttribute("style", "display: none");
  //       document.body.appendChild(iframe);
  //     }else {
  //       SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
  //     }
  //   });
  // }

  onNavigateToUsers() {
    this.router.navigate(["/main/platform/users/all-users"])
  }

}

