import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';
import { take } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { GridMenuIds, ModalSizes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { SkillGamesApiService } from '../../services/skill-games-api.service';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-cash-tables',
  templateUrl: './active-cash-tables.component.html',
  styleUrls: ['./active-cash-tables.component.scss']
})
export class ActiveCashTablesComponent extends BasePaginatedGridComponent implements OnInit {
  public path = 'cashtable/active';
  public rowData = [];

  constructor(protected injector: Injector, private _snackBar: MatSnackBar,
    public dialog: MatDialog, public apiService: SkillGamesApiService) {
    super(injector);
    this.adminMenuId = GridMenuIds.SG_CASH_TABLES_ACTIVE;
    this.columnDefs = [

      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.MinBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinBet',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.MaxBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxBet',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.JoinedPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'JoinedPlayersCount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.Speed',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Speed',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.NumberOfRounds',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NumberOfRounds',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.CurrentRound',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentRound',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'SkillGames.LastActionTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastActionTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastActionTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'SkillGames.TournamentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TournamentId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.TournamentRound',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TournamentRound',
        resizable: true,
        sortable: true,
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
  }

  async addCashTable() {
    const { AddCashTableComponent } = await import('./add-cash-table/add-cash-table.component');
    const dialogRef = this.dialog.open(AddCashTableComponent, { width: ModalSizes.MEDIUM });
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
        paging.PageSize = this.cacheBlockSize;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }


}
