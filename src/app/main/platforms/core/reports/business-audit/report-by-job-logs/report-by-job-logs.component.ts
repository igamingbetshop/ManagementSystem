import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { Paging } from "../../../../../../core/models";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { debounceTime, take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { Subject } from 'rxjs';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { formatDateTime } from 'src/app/core/utils';

@Component({
  selector: 'app-report-by-job-logs',
  templateUrl: '../report-by-logs/report-by-logs.component.html',
  styleUrls: ['../report-by-logs/report-by-logs.component.scss']
})
export class ReportByJobLogsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  title = 'Reports.ReportByJobLogs';
  rowData = [];
  filteredRowData = [];
  fromDate: any;;
  toDate: any;
  clientData = {};
  filteredData;
  partners = [];
  selectedItem = 'today';
  filter;
  nameFilterChanged: Subject<string> = new Subject<string>();
  stateFilterChanged: Subject<string> = new Subject<string>();
  messageFilterChanged: Subject<string> = new Subject<string>();
  frameworkComponents = {
    agDateTimeFilter: AgDateTimeFilter
  };

  idFilterChange: boolean = false;
  nameModel: any;
  filterModel: any;
  messageModel: any;
  paginationTotal: any;
  filterUsed: boolean = false;
  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_JOB_LOGS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: false,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: ['IsGreaterThanOrEqual'],
        },
      },
      {
        headerName: 'Common.JobId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'JobId',
        sortable: false,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: false,
        resizable: true,
        floatingFilter: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: false,
        resizable: true,
        floatingFilter: true,
      },
      {
        headerName: 'Clients.Message',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Message',
        sortable: false,
        resizable: true,
        floatingFilter: true,
      },
      {
        headerName: 'Common.PeriodInSeconds',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PeriodInSeconds',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Duration',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Duration',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.ExecutionTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExecutionTime',
        sortable: false,
        resizable: true,
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ExecutionTime, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Clients.NextExecutionTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NextExecutionTime',
        sortable: false,
        resizable: true,
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.NextExecutionTime, 'medium');
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
    this.setTime();
    this.partners = this.commonDataService.partners;
    this.setupFilterListeners();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.filter.Active = false;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setupFilterListeners() {
    this.nameFilterChanged.pipe(debounceTime(600)).subscribe(event => this.applyFilter(event, 'Name'));
    this.stateFilterChanged.pipe(debounceTime(620)).subscribe(event => this.applyFilter(event, 'State'));
    this.messageFilterChanged.pipe(debounceTime(640)).subscribe(event => this.applyFilter(event, 'Message'));
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasourceManual(data?, length?) {
    if (data) {
      return {
        getRows: (params) => {
          setTimeout(() => {
            this.filterUsed = false;
          }, 1000);
          params.success({ rowData: data, rowCount: length || data.length });
        }
      };
    }
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredRowData = [];
        if (paging.Ids) {
          paging.Id = paging.Ids.ApiOperationTypeList[0].IntValue;
          delete paging.Ids;
        }
        if (paging.JobIds) {
          paging.JobId = paging.JobIds.ApiOperationTypeList[0].IntValue;
          delete paging.JobIds;
        }
        this.filter = paging;
        if (this.filter.Active) {
          return;
        }
        this.apiService.apiPost(this.configService.getApiUrl, this.filter, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_JOB_LOGS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              this.rowData = data.ResponseObject.Entities;
              this.rowData.forEach((element) => {
                element.State = ACTIVITY_STATUSES.find(status => status.Id === element.State)?.Name;
              }
              );

              if (!!this.filterModel || !!this.nameModel || !!this.messageModel) {
                setTimeout(() => {
                  this.applyFilters();
                }, 0);
              }

              this.paginationTotal = data.ResponseObject.Count;
              this.filterUsed = false;
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onFilterChanged(event: any) {
    const idInstance = event.api.getFilterInstance('Id');
    const jobInstance = event.api.getFilterInstance('JobId');
    const statefilterInstance = event.api.getFilterInstance('State');
    const nameFilterInstance = event.api.getFilterInstance('Name');
    const messageFilterInstance = event.api.getFilterInstance('Message');
    this.filterModel = statefilterInstance?.getModel()?.filter;
    this.nameModel = nameFilterInstance?.getModel()?.filter;
    this.messageModel = messageFilterInstance?.getModel()?.filter;


    const filterModel = statefilterInstance?.getModel();
    const nameModel = nameFilterInstance?.getModel();
    const messageModel = messageFilterInstance?.getModel();
    this.nameModel = nameModel?.filter;
    this.filterModel = filterModel?.filter;
    this.messageModel = messageModel?.filter;

    if (idInstance && idInstance.getModel() || jobInstance && jobInstance.getModel()) {
      this.idFilterChange = true;
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      return;
    } else this.applyFilters();
  }

  applyFilters() {
    let filteredData = this.rowData;
    this.filterUsed = false;
    const filters = [
      { model: this.filterModel, key: 'State' },
      { model: this.nameModel, key: 'Name' },
      { model: this.messageModel, key: 'Message' }
    ];
  
    filters.forEach(filter => {
      console.log(filter);
      
      if (filter.model) {
        filteredData = filteredData.filter(item => 
          item[filter.key].toLowerCase().includes(filter.model.toLowerCase())
        );
        this.filterUsed = true;
      }
    });
  
    setTimeout(() => {
      const totalRecords = this.filterUsed ? undefined : this.paginationTotal;
      this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual(filteredData, totalRecords));
    }, 0);
  }
  

  applyFilter(event: string, type: string) {
    this[type + 'Model'] = event.toLowerCase();
    this.applyFilters();
  }

  setRowData() {
    this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual(this.rowData, this.paginationTotal));
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }
}
