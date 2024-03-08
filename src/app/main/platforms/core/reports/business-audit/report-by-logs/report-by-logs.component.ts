import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { ActivatedRoute } from "@angular/router";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { Paging } from "../../../../../../core/models";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { debounceTime, take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { Subject } from 'rxjs';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';

@Component({
  selector: 'app-report-by-logs',
  templateUrl: './report-by-logs.component.html',
  styleUrls: ['./report-by-logs.component.scss']
})
export class ReportByLogsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  filteredData;
  partners = [];
  partnerId;
  selectedItem = 'today';
  filter;
  filterInputChanged: Subject<string> = new Subject<string>();
  frameworkComponents = {
    agDateTimeFilter: AgDateTimeFilter
  };
  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_LOGS;
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
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
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
        headerName: 'Common.Caller',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Caller',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.Message',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Message',
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
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
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
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
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
    this.startDate();
    this.partners = this.commonDataService.partners;
    this.filterInputChanged.pipe(debounceTime(1000)).subscribe(event => {
      this.applyFilter(event);
    });
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.selectedItem = time;
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource(data?) {
    if(data) {
      return {
        getRows: (params) => {
          params.success({ rowData: data, rowCount: data.length });
        }
      };
    }
    return {
      getRows: (params) => {

        const paging = new Paging();

        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.apiService.apiPost(this.configService.getApiUrl, paging, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_LOGS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              this.rowData = data.ResponseObject.Entities;
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  inputChanged(event) {
    if (!!event) {
      this.filterInputChanged.next(event);
    } else {
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource(this.rowData));
    }
  }
  applyFilter(event) {
    event = event.toLowerCase();
    const myData = this.rowData.filter(item => item.Caller.toLowerCase().includes(event));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource(myData))
  }
  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }
}
