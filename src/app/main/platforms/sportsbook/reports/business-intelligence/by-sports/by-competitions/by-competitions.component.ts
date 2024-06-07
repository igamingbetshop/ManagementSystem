import { Component, Injector, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CellClickedEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { Paging } from 'src/app/core/models';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-by-competitions',
  templateUrl: './by-competitions.component.html',
  styleUrls: ['./by-competitions.component.scss']
})
export class ByCompetitionsComponent extends BasePaginatedGridComponent implements OnInit {

  partners: any[] = [];
  partnerId: number;
  path = "report/competitions";
  rowData = [];
  sportName: string;
  regionName: string;
  sportId: number;
  regionId: number;
  filter: any = {};
  fromDate = new Date();
  toDate = new Date();
  selectedItem = 'today';
  private totals = {
    totalBetAmount: 0,
    totalWinAmount: 0,
    totalProfit: 0
  };
  pageIdName =  '';
  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
        resizable: true,
        sortable: false,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.ProfitAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return `${(this.totals.totalBetAmount)}`;
          }

          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.BetAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return `${(this.totals.totalWinAmount)}`;
          }

          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.WinAmount, '1.2-2');
          return `${data}`;
        },
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return `${(this.totals.totalProfit)}`;
          }
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.ProfitAmount, '1.2-2');
          return `${data}`;
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
        onCellClicked: (event: CellClickedEvent) => this.goToMatchesMarket(event),
      },
    ];
  }

  ngOnInit() {
    this.sportId = this.route.snapshot.queryParams.sportId;
    this.sportName = this.route.snapshot.queryParams.sportName;
    this.regionName = this.route.snapshot.queryParams.regionName;
    this.regionId = this.route.snapshot.queryParams.regionId;
    this.partnerId = this.route.snapshot.queryParams.partnerId || 1;
    this.getPartners();
    this.startDate();
    this.pageIdName = `/ ${this.sportName} / ${this.regionName} : ${this.translate.instant('Sport.Competitions')}`;
  }

  startDate() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId !== undefined) {
      this.partnerId = event.partnerId;
    }
    this.getCurrentPage();
  }

  private parseDateTimeString(dateTimeString: string): Date {
    const dateTimeParts = dateTimeString.split('T');
    if (dateTimeParts.length === 2) {
      const [datePart, timePart] = dateTimeParts;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    return new Date();
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  go() {
    this.getCurrentPage();
  }

  goToMatchesMarket(ev) {
    const row = ev.data;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/main/sportsbook/business-intelligence/by-matches'],
      { queryParams: { "competitionId": row.CompetitionId } }));
    window.open(url, '_blank');
  }

  toRedirectToRegions() {
    this.router.navigate(['/main/sportsbook/business-intelligence/report-by-sports/regions'], {
      queryParams: { "sportId": this.sportId, "sportName": this.sportName, "partnerId": this.partnerId }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        paging.SpotId = this.sportId;
        paging.RegionId = this.regionId;
        paging.PartnerId = this.partnerId;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              const { Competitions } = data.ResponseObject;

              this.totals.totalBetAmount = data.ResponseObject.TotalBetAmount.toFixed(2);
              this.totals.totalWinAmount = data.ResponseObject.TotalWinAmount.toFixed(2);
              this.totals.totalProfit = data.ResponseObject.TotalProfit.toFixed(2);

              this.gridApi?.setPinnedBottomRowData([{
                BetAmount: `${(this.totals.totalBetAmount)}`,
                WinAmount: `${(this.totals.totalWinAmount)}`,
                ProfitAmount: `${(this.totals.totalProfit)}`,
              }
              ]);
              params.success({ rowData: Competitions, rowCount: Competitions.length });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
  }

}
