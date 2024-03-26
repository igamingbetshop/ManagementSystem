import { Component, Injector, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CellClickedEvent } from 'ag-grid-community';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { Paging } from 'src/app/core/models';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-sports-report',
  templateUrl: './sports-report.component.html',
  styleUrls: ['./sports-report.component.scss']
})
export class SportsReportComponent extends BasePaginatedGridComponent implements OnInit {

  public partners: any[] = [];
  public partnerId: number = 1;
  public path = "report/sports";
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public selectedItem = 'today';
  private totals = {
    totalBetAmount: 0,
    totalWinAmount: 0,
    totalProfit: 0
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  @Input() isHide: boolean = false;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_SPORTS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
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
        onCellClicked: (event: CellClickedEvent) => this.toRedirectToRegions(event),
      },
    ];
  }

  ngOnInit() {
    this.setTime();
    this.getPartners();
    this.getRows();
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

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
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

  toRedirectToRegions(ev) {
    const row = ev.data;
    this.router.navigate(['/main/sportsbook/business-intelligence/report-by-sports/regions'], {
      queryParams: { "sportId": row.SportId, "sportName": row.SportName, "partnerId": this.partnerId }
    });
  }

  getRows() {
    const paging = new Paging();
    paging.FromDate = this.fromDate;
    paging.ToDate = this.toDate;
    paging.PartnerId = this.partnerId;
    this.apiService.apiPost(this.path, paging)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const { Sports } = data.ResponseObject;
          this.rowData = Sports
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

}
