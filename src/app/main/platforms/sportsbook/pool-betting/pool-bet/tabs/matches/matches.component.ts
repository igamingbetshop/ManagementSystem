import {Component, OnInit, Injector, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {take} from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
import {GridMenuIds, GridRowModelTypes, ModalSizes, PBControllers, PBMethods} from 'src/app/core/enums';
import {syncColumnReset, syncPaginationWithoutBtn} from 'src/app/core/helpers/ag-grid.helper';
import {PoolBettingApiService} from "../../../../services/pool-betting-api.service";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-round-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent extends BasePaginatedGridComponent implements OnInit {

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
  };
  private roundStatuses: any;

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
    this.gridStateName = 'round-matches';
    this.roundId = Number(this.activateRoute.snapshot.queryParams.roundId);
    super.ngOnInit();
    this.getRoundMatches();
  }



  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'PoolBetting.AwayTeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AwayTeamId',
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
      },
      {
        headerName: 'Sport.Competitors',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Competitors',
      },
      {
        headerName: 'PoolBetting.HomeTeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HomeTeamId',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
      },
      {
        headerName: 'Sport.RegionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionId',
      },
      {
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
      },
    ]
  }

  getRoundMatches() {
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.GET_ROUND_MATCHES, {RoundId: this.roundId}).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  async addMatchToRound() {
    const {AddMatchComponent} = await import('./add-match/add-match.component');
    const dialogRef = this.dialog.open(AddMatchComponent, {width: ModalSizes.MIDDLE, data : {roundId: this.roundId}});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getRoundMatches();
      }
    })
  }

  deleteMatchFromRound() {
    const rowData = this.gridApi.getSelectedRows()[0];
    const requestData = {RoundId: this.roundId, MatchId: rowData.Id};
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.DELETE_MATCH_FROM_ROUND, requestData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getRoundMatches();
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
    this.getRoundMatches();
  }
}


