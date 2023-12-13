import {Component, Injector, OnInit} from '@angular/core';
import {VirtualGamesApiService} from "../services/virtual-games-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../components/classes/base-paginated-grid-component";
import {Paging} from "../../../../core/models";
import {take} from "rxjs/operators";
import 'ag-grid-enterprise';
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-bet-shops',
  templateUrl: './bet-shops.component.html',
  styleUrls: ['./bet-shops.component.scss']
})
export class BetShopsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public path = 'betshops';

  constructor(protected injector: Injector,
              public apiService: VirtualGamesApiService,
              private _snackBar: MatSnackBar) {
    super(injector);
    this.adminMenuId = GridMenuIds.VG_BET_SHOPS;
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
        headerName: 'Clients.Address',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Address',
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
        paging.PageIndex =this.paginationPage - 1;
        paging.PageSize = this.cacheBlockSize;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              params.success({rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count});
            } else {
              SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
            }
            setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 0);
          });
      },
    };
  }


  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }
}
