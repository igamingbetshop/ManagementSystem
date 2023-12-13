import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {VirtualGamesApiService} from "../../services/virtual-games-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {Paging} from "../../../../../core/models";
import {take} from "rxjs/operators";
import 'ag-grid-enterprise';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-all-players',
  templateUrl: './all-players.component.html',
  styleUrls: ['./all-players.component.scss']
})
export class AllPlayersComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public path = 'players';
  public genders: any[] = [
    {Id: 1, NickName: null, Name: "Male", Info: null},
    {Id: 2, NickName: null, Name: "Female", Info: null}
  ];

  constructor(protected injector: Injector,
              public apiService: VirtualGamesApiService,
              private _snackBar: MatSnackBar) {
    super(injector);
    this.adminMenuId = GridMenuIds.VG_PLAYERS;

    this.columnDefs = [

      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
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
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
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
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
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
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
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
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
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
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GenderName',
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
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
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
        headerName: 'Clients.CategoryName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
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
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'player');
          data.queryParams = {playerId: params.data.Id};
          return data;
        },
        sortable: false
      },
    ]
  }

  ngOnInit(): void {
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
        paging.PageSize =  Number(this.cacheBlockSize);

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.GenderName = this.genders.find((item => item.Id === items.Gender))?.Name;
                return items;
              });
              params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
            } else {
              SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
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
