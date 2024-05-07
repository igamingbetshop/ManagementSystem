import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { ActivatedRoute } from "@angular/router";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { OpenerComponent } from "../../../../../components/grid-common/opener/opener.component";
import { Paging } from "../../../../../../core/models";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { formattedNumber } from "../../../../../../core/utils";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-report-by-betshops',
  templateUrl: './report-by-betshops.component.html',
  styleUrls: ['./report-by-betshops.component.scss']
})
export class ReportByBetshopsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public partners = [];
  public partnerId;
  public playerCurrency;
  public selectedItem = 'today';

  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BETSHOPS;
    this.columnDefs = [
      {
        headerName: 'BetShops.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
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
        headerName: 'BetShops.BetGroupShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopGroupId',
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
        headerName: 'BetShops.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopName',
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
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        sortable: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.queryParams = { id: params.data.Id, toDate: this.toDate, fromDate: this.fromDate }
          data.path = this.router.url.split('?')[0] + '/' + +params.data.BetShopId;
          return data;
        },
        cellStyle: function (params) {
          if (params.node.rowPinned) {
            return { display: 'none' };
          } else {
            return {};
          }
        }

      }
    ]
  }

  ngOnInit(): void {
    this.setTime();    
    this.partners = this.commonDataService.partners;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
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

  onGridReady(params) {
    super.onGridReady(params);
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
          paging.BetDateFrom = this.fromDate;
          paging.BetDateBefore = this.toDate;
        } else {
          paging.SkipCount = this.paginationPage - 1;
          // paging.TakeCount = this.cacheBlockSize;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.BetDateFrom = this.fromDate;
          paging.BetDateBefore = this.toDate;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_BET_SHOPS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Entities.length });
              this.gridApi?.setPinnedBottomRowData([{
                BetAmount: `${formattedNumber(data.ResponseObject.TotalBetAmount)} ${this.playerCurrency}`,
                WinAmount: `${formattedNumber(data.ResponseObject.TotalWinAmount)} ${this.playerCurrency}`,
                Profit: `${formattedNumber(data.ResponseObject.TotalProfit)} ${this.playerCurrency}`,
              }
              ]);
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

}
