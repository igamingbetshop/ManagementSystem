import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { Paging } from 'src/app/core/models';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DecimalPipe } from "@angular/common";
import { DateAdapter } from "@angular/material/core";
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';


@Component({
  selector: 'app-by-players',
  templateUrl: './by-players.component.html',
  styleUrls: ['./by-players.component.scss']
})
export class ByPlayersComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  public commentTypes: any[] = [];
  TotalWinAmount;
  TotalBetAmount;
  TotalProfit;
  Currency;
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();
  public rowData = [];

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>
    //public router: ActivatedRoute,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_PLAYERS;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Client Id',
        field: 'ClientId',
        resizable: true,
        sortable: true,
        minWidth: 80,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return {
              color: 'white',
              'font-size': '14px',
              'font-weight': '500',
              'padding-left': '10px',
              backgroundColor: params.data.CategoryColor
            };
          } else {
            return { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px' };
          }
        }
      },
      {
        headerName: 'Nick Name',
        field: 'NickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        }
      },
      {
        headerName: 'Player Category Id',
        field: 'PlayerCategoryId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        }
      },
      {
        headerName: 'Partner Name',
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        }
      },
      {
        headerName: 'Bet Amount',
        field: 'BetAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.BetAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Win Amount',
        field: 'WinAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.WinAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Profit',
        field: 'ProfitAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.ProfitAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Currency',
        field: 'CurrencyId',
        resizable: true,
        sortable: true,

        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        }
      },
      {
        headerName: 'View',
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          } else {
            return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
            </i>`
          }

        },
        cellStyle: function (params) {
          if (params.data.CategoryColor !== '#FFFFFF') {
            return { color: 'white', backgroundColor: params.data.CategoryColor };
          } else {
            return null
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.goToReportByBets(event),
      },

    ];
  }

  ngOnInit() {
    this.Currency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.setTime();
  }

  goToReportByBets(ev) { 
    const playerId = ev.data.PlayerId;       
    if (playerId) {
        const url = this.router.serializeUrl(this.router.createUrlTree([`/main/sportsbook/players/player/bets`], { queryParams: { playerId: playerId } }));
        if (url) {
            window.open(url, '_blank');
        } else {
            console.error('Failed to construct URL');
        }
    } else {
        console.error('Player ID is missing or invalid');
    }
}


  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
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
        paging.pageindex = params.request.startRow / Number(this.cacheBlockSize);
        paging.pagesize = Number(this.cacheBlockSize);

        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);

        delete paging.StartDate;
        delete paging.EndDate;

        this.apiService.apiPost('report/players', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            this.TotalWinAmount = data.TotalWinAmount;
            this.TotalBetAmount = data.TotalBetAmount;
            this.TotalProfit = data.TotalProfit;

            params.success({ rowData: data.Objects, rowCount: data.TotalCount });

            this.gridApi?.setPinnedBottomRowData([
              {
                BetAmount: `${this.TotalBetAmount}`,
                WinAmount: `${this.TotalWinAmount}`,
                ProfitAmount: `${this.TotalProfit}`,
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
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }
}
