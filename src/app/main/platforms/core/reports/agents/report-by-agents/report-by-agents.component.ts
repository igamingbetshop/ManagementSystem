import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import {DateHelper} from "../../../../../components/partner-date-filter/data-helper.class";
import {AgGridAngular} from "ag-grid-angular";
import {CoreApiService} from "../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ExportService} from "../../../services/export.service";
import {syncColumnReset, syncColumnSelectPanel} from "../../../../../../core/helpers/ag-grid.helper";
import {Paging} from "../../../../../../core/models";
import {Controllers, GridMenuIds, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {GetServerSideGroupKey, ICellRendererParams, IsServerSideGroup} from "ag-grid-community";
import {AgBooleanFilterComponent} from "../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {AgDropdownFilter} from "../../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";

@Component({
  selector: 'app-report-by-agents',
  templateUrl: './report-by-agents.component.html',
  styleUrl: './report-by-agents.component.scss'
})
export class ReportByAgentsComponent extends BasePaginatedGridComponent implements OnInit {
  // @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public selectedItem;
  public partnerId;
  public partners = [];
  public frameworkComponents;
  defaultColDef = {
    width: 240,
    editable: false,
    flex: 1,
    sortable: false,
    resizable: true,
    filter: false,
    suppressMenu: true,
    minWidth: 50,
  };

  autoGroupColumnDef = {
    headerName: 'Agent Id',
    field: 'AgentId',
    checkboxSelection: false,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.AgentId;
      },
    },
  };

  isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };

  getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.AgentId;
  };


  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_AGENTS;
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
    }
    this.setColumnDefs();
  }

  ngOnInit(): void {
    this.setTime();
    this.partners = this.commonDataService.partners;
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    }
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.AgentFirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AgentFirstName',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.AgentLastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AgentLastName',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.AgentUserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AgentUserName',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalDepositCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDepositCount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalWithdrawCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawCount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalDepositAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDepositAmount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalWithdrawAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawAmount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetAmount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalUnsettledBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalUnsettledBetsCount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalDeletedBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDeletedBetsCount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinAmount',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalProfit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalProfit',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalProfitPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalProfitPercent',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalGGRCommission',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalGGRCommission',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
      {
        headerName: 'Common.TotalTurnoverCommission',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalTurnoverCommission',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
        minWidth: 80,
      },
    ];
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
        // this.getAgents(paging, params);
        if (params.parentNode.data) {
          paging['ParentId'] = String(params.parentNode.data.AgentId);
          // if (params.parentNode.data?.Level === 6) {
          //   group false // to do
          // } else {
          this.getAgents(paging, params);
          // }
        } else {
          this.getAgents(paging, params);
        }
      }
    }
  }

  getAgents(paging, params) {
    this.apiService.apiPost(this.configService.getApiUrl, paging, true,
      Controllers.AGENT, Methods.GET_REPORT_BY_AGENTS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const mappedRows = data.ResponseObject.Entities;

        this.rowData = mappedRows;
        mappedRows.forEach((entity) => {
          entity.group = true;
        })
        params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }
}
