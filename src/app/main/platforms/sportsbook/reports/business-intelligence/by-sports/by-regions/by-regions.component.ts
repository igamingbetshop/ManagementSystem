import { Component, Injector, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CellClickedEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { Paging } from 'src/app/core/models';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-by-regions',
  templateUrl: './by-regions.component.html',
  styleUrls: ['./by-regions.component.scss'],
})
export class ByRegionsComponent extends BasePaginatedGridComponent implements OnInit {

  partners: any[] = [];
  sportId: number;
  sportName: string;
  path = "report/regions";
  partnerId: number;
  rowData = [];
  pageIdName =  '';
  fromDate = new Date();
  toDate = new Date();
  selectedItem = 'today';
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  private totals = {
    totalBetAmount: 0,
    totalWinAmount: 0,
    totalProfit: 0
  };

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
        field: 'RegionId',
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
      },
      {
        headerName: 'Common.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return `${(this.totals.totalBetAmount)}`;
          }
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.BetAmount, '1.2-2');
          return `${data}`;
        },
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
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
        headerName: 'Sport.ProfitAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
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
        onCellClicked: (event: CellClickedEvent) => this.toRedirectToCompetitions(event),
      },
    ];
  }

  ngOnInit() {
    this.sportId = +this.route.snapshot.queryParams.sportId;
    this.sportName = this.route.snapshot.queryParams.sportName;
    this.partnerId = +this.route.snapshot.queryParams.partnerId;
    this.setTime();
    this.getPartners();
    this.getRows();
    this.pageIdName = `/ ${this.sportName} : ${this.translate.instant('Sport.Regions')}`;

  }

  setTime() {
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
    this.getRows();
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

  toRedirectToCompetitions(ev) {
    const row = ev.data;
    this.router.navigate(['/main/sportsbook/business-intelligence/report-by-sports/competitions'], {
      queryParams: { "sportId": row.SportId, "partnerId": this.partnerId, "sportName": row.SportName, "regionId": row.RegionId, "regionName": row.RegionName }
    });
  }

  getRows() {
    const paging = new Paging();
    paging.FromDate = this.fromDate;
    paging.PartnerId = this.partnerId;
    paging.ToDate = this.toDate;
    paging.SportId = this.sportId;
    this.apiService.apiPost(this.path, paging)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const { Regions } = data.ResponseObject;
          this.rowData = Regions;
          this.totals.totalBetAmount = data.ResponseObject.TotalBetAmount.toFixed(2);
          this.totals.totalWinAmount = data.ResponseObject.TotalWinAmount.toFixed(2);
          this.totals.totalProfit = data.ResponseObject.TotalProfit.toFixed(2);
          this.gridApi?.setPinnedBottomRowData([{
            BetAmount: `${(this.totals.totalBetAmount)}`,
            WinAmount: `${(this.totals.totalWinAmount)}`,
            ProfitAmount: `${(this.totals.totalProfit)}`,
          }
          ]);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
  }

  onNavigateToSport() {
    this.router.navigate(["/main/sportsbook/business-intelligence/report-by-sports"])
  }

}
