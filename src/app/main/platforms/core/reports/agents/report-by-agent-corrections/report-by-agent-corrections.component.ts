import { Component, Injector, OnInit, signal, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { Paging } from "../../../../../../core/models";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../../services/export.service";
import { formatDateTime } from 'src/app/core/utils';

@Component({
  selector: 'app-report-by-agent-corrections',
  templateUrl: './report-by-agent-corrections.component.html',
  styleUrls: ['./report-by-agent-corrections.component.scss']
})
export class ReportByAgentCorrectionsComponents extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  fromDate: any;
  public toDate: any;
  public filteredData;
  public partnerId;
  public partners = signal(null);
  title = 'Reports.ReportByAgentCorrections';
  method = Methods.GET_REPORT_BY_AGENT_CORRECTIONS;
  exportMethod = Methods.EXPORT_REPORT_BY_AGENT_CORRECTIONS;

  constructor(
    protected apiService: CoreApiService,
    protected configService: ConfigService,
    protected _snackBar: MatSnackBar,
    protected commonDataService: CommonDataService,
    protected exportService: ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_AGENTS_CORRECTIONS;
    this.columnDefs = [
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
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
        headerName: 'Common.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: false,
        cellRenderer: (params: { value: any; }) => {
          const _partnerId = params.value;
          const partnerObject = this.partners()?.find((gender) => gender.Id === _partnerId);
          if (partnerObject) {
            return partnerObject.Name;
          }
          // return 'Unknown Gender';
        },

      },
      {
        headerName: 'Clients.CurrentBalance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentBalance',
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
        headerName: 'Clients.TotalDebit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDebit',
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
        headerName: 'Clients.TotalCredit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCredit',
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
        headerName: 'Clients.TotalCost',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCost',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ]
  }

  ngOnInit(): void {
    this.setTime();
    this.partners.set(this.commonDataService.partners);
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.partnerId = event.partnerId ? event.partnerId : null;
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
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
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, this.method).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;

              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }

  exportToCsv() {

    this.exportService.exportToCsv(Controllers.REPORT, this.exportMethod, { ...this.filteredData, adminMenuId: this.adminMenuId });
  }

}
