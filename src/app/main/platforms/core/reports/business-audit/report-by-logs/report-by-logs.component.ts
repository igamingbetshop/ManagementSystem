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
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-report-by-logs',
  templateUrl: './report-by-logs.component.html',
  styleUrls: ['./report-by-logs.component.scss']
})
export class ReportByLogsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  rowData = [];
  filteredRowData = [];
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  filteredData;
  partners = [];
  selectedItem = 'today';
  filter;
  callerFilterChanged: Subject<string> = new Subject<string>();
  typeFilterChanged: Subject<string> = new Subject<string>();
  messageFilterChanged: Subject<string> = new Subject<string>();
  frameworkComponents = {
    agDateTimeFilter: AgDateTimeFilter
  };
  

  idFilterChange: boolean = false;
  typeModel: any;
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
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_LOGS;
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
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: false,
        resizable: true,
        floatingFilter: true,
      },
      {
        headerName: 'Common.Caller',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Caller',
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
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: false,
        resizable: true,
        filter: false,
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
    this.setTime();
    this.partners = this.commonDataService.partners;
    this.setupFilterListeners();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.filter.Active = false;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setupFilterListeners() {
    this.typeFilterChanged.pipe(debounceTime(600)).subscribe(event => this.applyFilter(event, 'Type'));
    this.callerFilterChanged.pipe(debounceTime(620)).subscribe(event => this.applyFilter(event, 'Caller'));
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
        this.filter = paging;
        if (this.filter.Active) {
          return;
        }
        this.apiService.apiPost(this.configService.getApiUrl, this.filter, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_LOGS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              this.rowData = data.ResponseObject.Entities;

              if (!!this.filterModel || !!this.typeModel || !!this.messageModel) {
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
    const IdInstance = event.api.getFilterInstance('Id');
    const filterInstance = event.api.getFilterInstance('Caller');
    const typeFilterInstance = event.api.getFilterInstance('Type');
    const messageFilterInstance = event.api.getFilterInstance('Message');
    this.filterModel = filterInstance?.getModel()?.filter;
    this.typeModel = typeFilterInstance?.getModel()?.filter;
    this.messageModel = messageFilterInstance?.getModel()?.filter;


    const filterModel = filterInstance?.getModel();
    const typeModel = typeFilterInstance?.getModel();
    const messageModel = messageFilterInstance?.getModel();
    this.typeModel = typeModel?.filter;
    this.filterModel = filterModel?.filter;
    this.messageModel = messageModel?.filter;

    if (IdInstance && IdInstance.getModel()) {
      this.idFilterChange = true;
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      return;
    } else this.applyFilters();
  }

  applyFilters() {
    let filteredData = this.rowData;
    this.filterUsed = false;
    if (this.filterModel) {
      filteredData = filteredData.filter(item => item.Caller.toLowerCase().includes(this.filterModel.toLowerCase()));
      this.filterUsed = true;
    }
    if (this.typeModel) {
      filteredData = filteredData.filter(item => item.Type.toLowerCase().includes(this.typeModel.toLowerCase()));
      this.filterUsed = true;
    }
    if (this.messageModel) {
      filteredData = filteredData.filter(item => item.Message.toLowerCase().includes(this.messageModel.toLowerCase()));
      this.filterUsed = true;
    }
    if(this.filterUsed) {
      setTimeout(() => {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual(filteredData))
      }, 0);
    } else {
      setTimeout(() => {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual(filteredData, this.paginationTotal))
      }, 0);
    }
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
