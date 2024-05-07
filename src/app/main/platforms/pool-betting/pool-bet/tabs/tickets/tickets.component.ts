import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import { GridMenuIds, GridRowModelTypes, PBControllers, PBMethods } from 'src/app/core/enums';
import { syncColumnReset, syncPaginationWithoutBtn } from 'src/app/core/helpers/ag-grid.helper';
import { ActivatedRoute } from "@angular/router";
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { PoolBettingApiService } from 'src/app/main/platforms/sportsbook/services/pool-betting-api.service';

@Component({
  selector: 'app-round-matches',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  public roundId: number;
  public rowData = [];
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

  constructor(
    private apiService: PoolBettingApiService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.PB_MATCHES; // TODO change number
    this.setColumnDefs();
  }

  ngOnInit() {
    this.gridStateName = 'round-tickets';
    this.roundId = this.activateRoute.snapshot.queryParams.roundId;
    super.ngOnInit();
    this.getRoundTickets();
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
      },
      {
        headerName: 'Clients.CashierId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
      },
      {
        headerName: 'PoolBetting.RoundId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Number',
      },
      {
        headerName: 'Common.Code',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Code',
        filter: false,
      },
      {
        headerName: 'Clients.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
        filter: false,
      },
      {
        headerName: 'Clients.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShop',
      },
      {
        headerName: 'Common.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: ' BetAmount',
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
      },
      {
        headerName: 'PoolBetting.Jackpot',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Jackpot',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
      },
    ]
  }

  getRoundTickets() {
    this.apiService.apiPost(PBControllers.REPORT, PBMethods.GET_TICKETS, { RoundId: this.roundId }).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject
      } else {
        SnackBarHelper.show(this._snackBar, { Description: 'Will be ready soon', Type: "error" });
      }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncPaginationWithoutBtn();
    syncColumnReset();
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.getRoundTickets();
  }
}


