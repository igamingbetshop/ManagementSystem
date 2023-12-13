import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SkillGamesApiService} from "../../services/skill-games-api.service";
import 'ag-grid-enterprise';
import {Paging} from "../../../../../core/models";
import {take} from "rxjs/operators";
import {CommonDataService} from "../../../../../core/services";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {GridMenuIds, ModalSizes, ObjectTypes} from "../../../../../core/enums";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {CellDoubleClickedEvent} from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-tournaments',
  templateUrl: './finished-tournaments.component.html',
  styleUrls: ['./finished-tournaments.component.scss']
})
export class FinishedTournamentsComponent extends BasePaginatedGridComponent implements OnInit {
  public path = 'tournament/finished';
  public delPath = 'active-tournament/delete';
  public rowData = [];
  public partners = [];
  public partnerId;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    public apiService: SkillGamesApiService
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SG_TOURNUMENT_FINISHED;
    this.columnDefs = [
      {
        field: 'Id',
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'GameId',
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'PartnerId',
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'Name',
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'Type',
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'MinimumPlayersCount',
        headerName: 'SkillGames.MinimumPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'MaximumPlayersCount',
        headerName: 'SkillGames.MaximumPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'JoinFee',
        headerName: 'SkillGames.JoinFee',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'Speed',
        headerName: 'SkillGames.Speed',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'NumberOfRounds',
        headerName: 'SkillGames.RoundsCount',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'PrizePool',
        headerName: 'Home.SkillGames',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'BuyInRound',
        headerName: 'SkillGames.BuyInRound',
        headerValueGetter: this.localizeHeader.bind(this),
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
        field: 'PoolDistribution',
        headerName: 'SkillGames.Distribution',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        field: 'RegularityCount',
        headerName: 'SkillGames.RegularityCount',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        field: 'RegularityTime',
        headerName: 'SkillGames.RegularityTime',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        field: 'OpenTime',
        headerName: 'SkillGames.AnnounceDate',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        field: 'StartTime',
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
        sortable: false,
        filter: false,
        suppressMenu: true
      }
    ]
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
  }

  onPartnerChange(value: number) {
    this.partnerId = value;
    this.getCurrentPage()
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
        if (this.partnerId) {
          paging.PartnerId = this.partnerId
        }

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            params.success({rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count});
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
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
