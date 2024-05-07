import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DecimalPipe } from "@angular/common";

import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CellClickedEvent } from 'ag-grid-community';

import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { Paging } from "../../../../../../core/models";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import {ExportService} from "../../../services/export.service";

@Component({
  selector: 'app-report-by-games',
  templateUrl: './report-by-games.component.html',
  styleUrls: ['./report-by-games.component.scss']
})
export class ReportByGamesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public partners = [];
  public partnerId;
  public providers = [];
  public rowClassRules;
  public filteredData;
  public playerCurrency;
  public selectedItem = 'today';

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_GAMES;
    this.columnDefs = [
      {
        headerName: 'SkillGames.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
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
        headerName: 'Common.ProductName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
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
        headerName: 'Sport.ProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderId',
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
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
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
        headerName: 'Products.SubproviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderId',
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
        headerName: 'Providers.SubproviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderName',
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
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
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
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.BetAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.WinAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.Profit?.toFixed(2),
      },
      {
        headerName: 'Sport.ProfitPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitPercent',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.ProfitPercent?.toFixed(2),
      },
      {
        headerName: 'Sport.SupplierPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SupplierPercent',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.SupplierPercent?.toFixed(2),
      },
      {
        headerName: 'Sport.SupplierFee',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SupplierFee',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.SupplierFee?.toFixed(2),
      },
      {
        headerName: 'Common.OriginalBetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OriginalBetAmount',
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
        headerName: 'Common.OriginalWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OriginalWinAmount',
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
        headerName: 'Partners.Count',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Count',
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
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.toRedirectReportByBets(event),
      },

    ]
    this.rowClassRules = {
      'bets-status-2': function (params) {
        let numSickDays = params.data?.Profit;
        return numSickDays < 0;
      },
      'bets-status-1': function (params) {
        let numSickDays = params.data?.Profit;
        return numSickDays >= 0;
      }
    };
  }

  ngOnInit(): void {
    this.setTime();
    this.partners = this.commonDataService.partners;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.getProviders();
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
    } else {
      this.partnerId = null;
    }
    this.getCurrentPage();
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
  }

  getProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.providers = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
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
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.BetDateFrom = this.fromDate;
          paging.BetDateBefore = this.toDate;
        } else {
          paging.SkipCount = this.paginationPage - 1;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.BetDateFrom = this.fromDate;
          paging.BetDateBefore = this.toDate;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_INTERNET_GAMES).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.ProviderName = this.providers.find((item => item.Id === items.ProviderId))?.Name;
                return items;
              });
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Entities.length });
              this.gridApi?.setPinnedBottomRowData([
                {
                  BetAmount: `${data.ResponseObject.TotalBetAmount?.toFixed(2)}`,
                  WinAmount: `${data.ResponseObject.TotalWinAmount?.toFixed(2)}`,
                }
              ]);
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  toRedirectReportByBets(ev) {
    const row = ev.data;
    this.router.navigate(['/main/platform/reports/internet-clients/report-by-bets/'], {
      queryParams: { "gameId": row.GameId }
    });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    delete this.filteredData.StartDate;
    delete this.filteredData.EndDate;
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_REPORT_BY_INTERNET_GAMES, { ...this.filteredData, adminMenuId: this.adminMenuId });
  }

}
