import {Component, OnInit, Injector, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {take} from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
import {GridMenuIds, GridRowModelTypes, ModalSizes, PBControllers, PBMethods} from 'src/app/core/enums';
import {syncColumnReset, syncPaginationWithoutBtn} from 'src/app/core/helpers/ag-grid.helper';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {CommonDataService} from "../../../../../core/services";
import {PoolBettingApiService} from "../../services/pool-betting-api.service";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";

@Component({
  selector: 'app-all-pool-betting',
  templateUrl: './all-pool-betting.component.html',
  styleUrls: ['./all-pool-betting.component.scss'],
})
export class AllPoolBettingComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;

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

  private roundStatuses =  RoundStatuses;

  constructor(
    private apiService: PoolBettingApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.POOL_BETTING;
    this.setColumnDefs();
  }

  ngOnInit() {
    this.gridStateName = 'all-pool-betting';
    super.ngOnInit();
    this.getRoundsList()
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'PoolBetting.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
      },
      {
        headerName: 'PoolBetting.Number',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Number',
      },
      {
        headerName: 'PoolBetting.OpenTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OpenTime',
        filter: false,
      },
      {
        headerName: 'PoolBetting.CloseTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CloseTime',
        filter: false,
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
      },
      {
        headerName: 'PoolBetting.Blocked',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Blocked',
      },
      {
        headerName: 'PoolBetting.TicketsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TicketsCount',
      },
      {
        headerName: 'PoolBetting.Jackpot',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Jackpot',
      },
      {
        headerName: 'PoolBetting.PoolAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PoolAmount',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        minWidth: 60,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'pool-bet');
          data.queryParams = { roundId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ]
  }

  getRoundsList() {
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.GET_ROUNDS_LIST, {TypeId: null}).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject.map(round => {
          round.Status = this.roundStatuses.find(status => status.Id == round.Status)?.Name;
          return round;
        });
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  async addRound() {
    const {AddRoundComponent} = await import('../add-round/add-round.component');
    const dialogRef = this.dialog.open(AddRoundComponent, {width: ModalSizes.MIDDLE});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getRoundsList();
      }
    })
  }

  deleteRound() {
    const rowData = this.gridApi.getSelectedRows()[0];
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.DELETE_ROUND, {RoundId: rowData.Id})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getRoundsList();
          SnackBarHelper.show(this._snackBar, {Description: data.ResponseObject, Type: "success"});
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncPaginationWithoutBtn();
    syncColumnReset();
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.getRoundsList();
  }
}

export const RoundStatuses = [
  {Id: 1,  Name : 'UnderConfiguration'},
  {Id: 2,  Name : 'AvailableForBetting'},
  {Id: 3,  Name : 'Pending'},
  {Id: 4,  Name : 'Resulted'},
  {Id: 5,  Name : 'Closed'},
];

