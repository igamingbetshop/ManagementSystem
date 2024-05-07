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
  @ViewChild('caller') callerInput: ElementRef;

  rowData = [];
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  filteredData;
  partners = [];
  partnerId;
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
    this.callerFilterChanged.pipe(debounceTime(600)).subscribe(event => {
      this.applyFilter(event, "Caller");
    });
    this.typeFilterChanged.pipe(debounceTime(600)).subscribe(event => {
      this.applyFilter(event, 'Type');
    });
    this.messageFilterChanged.pipe(debounceTime(600)).subscribe(event => {
      this.applyFilter(event, 'Message');
    });
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
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
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
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
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
                  this.callerChanged(this.filterModel || null);
                  this.typeChanged(this.typeModel || null);
                  this.messageChanged(this.messageModel || null);
                }, 0);
              }

              this.paginationTotal = data.ResponseObject.Count;
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  callerChanged(event?) {
    if (event) {
      this.callerFilterChanged.next(event);
    } else {
      this.setRowData()
    }
  }

  typeChanged(event?) {
    if (event) {
      this.typeFilterChanged.next(event);
    } else {
      this.setRowData()
    }
  }

  messageChanged(event?) {
    if (event) {
      this.messageFilterChanged.next(event);
    } else {
      this.setRowData()
    }
  }

  onFilterChanged(event: any) {
    const IdInstance = event.api.getFilterInstance('Id');
    const filterInstance = event.api.getFilterInstance('Caller');
    const typeFilterInstance = event.api.getFilterInstance('Type');
    const messageFilterInstance = event.api.getFilterInstance('Message');
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
    } else if (this.idFilterChange && !IdInstance.getModel()) {
      this.idFilterChange = false;
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      return;
    }

    this.callerChanged(this.filterModel);
    this.typeChanged(this.typeModel);
    this.messageChanged(this.messageModel);
    if (!!this.filterModel) {
    }
    if (!!this.typeModel) {
    }
    if (!!this.messageModel) {
    }
    return;
    if (!filterInstance) {
      this.filter = null
    }
  }

  setRowData() {
    this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual(this.rowData, this.paginationTotal));
  }

  applyFilter(event, type) {
    event = event.toLowerCase();
    const data = this.rowData;
    const myData = data.filter(item => item[type].toLowerCase().includes(event));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual(myData))
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }
}
