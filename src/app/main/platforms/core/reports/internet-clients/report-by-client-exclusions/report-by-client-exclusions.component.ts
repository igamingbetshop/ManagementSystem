import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {CoreApiService} from "../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import 'ag-grid-enterprise';
import {Paging} from "../../../../../../core/models";
import {Controllers, GridMenuIds, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import { ICellRendererParams } from 'ag-grid-enterprise';
import { TranslateService } from '@ngx-translate/core';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-report-by-client-exclusions',
  templateUrl: './report-by-client-exclusions.component.html',
  styleUrls: ['./report-by-client-exclusions.component.scss']
})
export class ReportByClientExclusionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public partners = [];
  public status = [];
  public partnerId;
  public selectedItem = 'today';

  constructor(
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_CLIENT_EXCLUSIONS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
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
        field: 'PartnerName',
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
        field: 'Username',
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
        headerName: 'Clients.DepositLimitDaily',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DepositLimitDaily',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.DepositLimitWeekly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DepositLimitWeekly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.DepositLimitMonthly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DepositLimitMonthly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.TotalBetAmountLimitDaily',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetAmountLimitDaily',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.TotalBetAmountLimitWeekly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetAmountLimitWeekly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.TotalBetAmountLimitMonthly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetAmountLimitMonthly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.TotalLossLimitDaily',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalLossLimitDaily',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.TotalLossLimitWeekly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalLossLimitWeekly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.TotalLossLimitMonthly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalLossLimitMonthly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemTotalBetAmountLimitDaily',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemTotalBetAmountLimitDaily',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemTotalBetAmountLimitWeekly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemTotalBetAmountLimitWeekly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemTotalBetAmountLimitMonthly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemTotalBetAmountLimitMonthly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemTotalLossLimitDaily',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemTotalLossLimitDaily',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemTotalLossLimitWeekly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemTotalLossLimitWeekly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemTotalLossLimitMonthly',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemTotalLossLimitMonthly',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SessionLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SessionLimit',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.SystemSessionLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemSessionLimit',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ]
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
          paging.SkipCount = this.paginationPage - 1;
          // paging.TakeCount = this.cacheBlockSize;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.FromDate = this.fromDate;
          paging.ToDate = this.toDate;
        } else {
          paging.SkipCount = this.paginationPage - 1;
          // paging.TakeCount = this.cacheBlockSize;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.FromDate = this.fromDate;
          paging.ToDate = this.toDate;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_CLIENT_EXCLUSION).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.Entities.map((items) => {
              items.PartnerName = this.partners.find((item => item.Id === items.PartnerId))?.Name;
              items.StateName = this.status.find((item => item.Id === items.Status))?.Name;
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

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    // this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
    //   Controllers.DASHBOARD, Methods.EXPORT_CLIENTS_INFO_LIST).pipe(take(1)).subscribe((data) => {
    //   if (data.ResponseCode === 0) {
    //     var iframe = document.createElement("iframe");
    //     iframe.setAttribute("src", this.configService.defaultOptions.WebApiUrl + '/' + data.ResponseObject.ExportedFilePath);
    //     iframe.setAttribute("style", "display: none");
    //     document.body.appendChild(iframe);
    //   }else {
    //     SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
    //   }
    // });
  }


}
