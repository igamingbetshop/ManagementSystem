import { Component, Injector, OnInit } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../components/classes/base-paginated-grid-component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { SkillGamesApiService } from "../../services/skill-games-api.service";
import 'ag-grid-enterprise';
import { Paging } from "../../../../../core/models";
import { take } from "rxjs/operators";
import { CommonDataService } from "../../../../../core/services";
import { OpenerComponent } from "../../../../components/grid-common/opener/opener.component";
import { GridMenuIds, ModalSizes, ObjectTypes } from "../../../../../core/enums";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CellDoubleClickedEvent } from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './active-tournaments.component.html',
  styleUrls: ['./active-tournaments.component.scss']
})
export class ActiveTournamentsComponent extends BasePaginatedGridComponent implements OnInit {
  public path = 'tournament/active';
  public delPath = 'tournament/delete';
  public rowData = [];
  public partners = [];
  public partnerId;
  public tournamentTypes = [
    { Id: '1', Name: 'Regular Tournament' },
    { Id: '2', Name: 'VIP Tournament' },
    { Id: '3', Name: 'Sit&Go' }
  ]
  public frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };

  constructor(protected injector: Injector, private _snackBar: MatSnackBar, public commonDataService: CommonDataService,
    public dialog: MatDialog, public apiService: SkillGamesApiService) {
    super(injector);
    this.adminMenuId = GridMenuIds.SG_TOURNUMENT_ACTIVE;
    this.columnDefs = [
      {
        field: 'Id',
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        checkboxSelection: true,
      },
      {
        field: 'GameId',
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'PartnerId',
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'Name',
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        field: 'Type',
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.tournamentTypes,
        },
      },
      {
        field: 'MinimumPlayersCount',
        headerName: 'SkillGames.MinimumPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'MaximumPlayersCount',
        headerName: 'SkillGames.MaximumPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'JoinFee',
        headerName: 'SkillGames.JoinFee',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'Speed',
        headerName: 'SkillGames.Speed',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'NumberOfRounds',
        headerName: 'SkillGames.RoundsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'PrizePool',
        headerName: 'Home.SkillGames',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'BuyInRound',
        headerName: 'SkillGames.BuyInRound',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'PoolDistribution',
        headerName: 'SkillGames.Distribution',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'RegularityCount',
        headerName: 'SkillGames.RegularityCount',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'RegularityTime',
        headerName: 'SkillGames.RegularityTime',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'OpenTime',
        headerName: 'SkillGames.AnnounceDate',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        field: 'StartTime',
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
        sortable: false
      }
    ]
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
  }

  onPartnerChange(val: number) {
    this.partnerId = val;
    this.getCurrentPage()
  }

  async addTournament() {
    const { AddTournamentComponent } = await import('./add-tournament/add-tournament.component');
    const dialogRef = this.dialog.open(AddTournamentComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    })
  }


  deleteTournament() {
    const id = this.gridApi.getSelectedRows()[0]?.Id;
    this.apiService.apiPost(this.delPath, { Id: id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getCurrentPage();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const id = event.data.Id;
    const { AddEditTranslationComponent } = await import('src/app/main/platforms/skill-games/tournaments/active-tournaments/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: ObjectTypes.PaymentSystem
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    })
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
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.Images = [{}, {}]
        if (this.partnerId) {
          paging.PartnerId = this.partnerId
        }

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const _rowData = data.ResponseObject.Entities;
            _rowData.forEach(element => {
              if (element.Type) {
                element.Type = this.tournamentTypes.find(p => p.Id == element.Type).Name;
              }
            });
            params.success({ rowData: _rowData, rowCount: data.ResponseObject.Count });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  setSort(sortModel, appendObj) {
    if (sortModel && sortModel.length) {
      appendObj.OrderByDescending = sortModel[0].sort === 'asc' ? 0 : 1;
      appendObj.FieldNameToOrderBy = sortModel[0].colId;
    } else {
      appendObj.OrderByDescending = null;
      appendObj.FieldNameToOrderBy = '';
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
