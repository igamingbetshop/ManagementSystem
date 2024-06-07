import { Component, OnInit, Injector } from '@angular/core';

import { map, take } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { AgBooleanFilterComponent } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../components/grid-common/numeric-editor.component";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { MatDialog } from '@angular/material/dialog';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { VirtualGamesApiService } from '../../services/virtual-games-api.service';
import { Paging } from 'src/app/core/models';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss']
})
export class CoinsComponent extends BasePaginatedGridComponent implements OnInit {
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    agDropdownFilter: AgDropdownFilter,
  };
  rowData = [];
  partners = [];
  games = [];
  path: string = 'common/coins';
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  isSendingReqest = false;
  cacheBlockSize = 5000;

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
    private apiService: VirtualGamesApiService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadAllData();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPartners() {
    return this.apiService.apiPost('partners').pipe(
      take(1),
      map(data => {
        if (data.ResponseCode === 0) {
          this.partners = data.ResponseObject.Entities;
          console.log(this.partners, 'partners');
          return data.ResponseObject.Entities;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          throw new Error('Failed to load partners');
        }
      })
    );
  }
  
  getGames() {
    return this.apiService.apiPost('game').pipe(
      take(1),
      map(data => {
        if (data.ResponseCode === 0) {
          this.games = data.ResponseObject;
          return data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          throw new Error('Failed to load games');
        }
      })
    );
  }
  
  setColdefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
      },
      {
        headerName: 'SkillGames.GameName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameName',
      },
      {
        headerName: 'Payments.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
      },
      {
        headerName: 'Bonuses.Value',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Value',
      },
    ]
  }
  
  loadAllData() {
    forkJoin({
      partners: this.getPartners(),
      games: this.getGames()
    }).subscribe(
      () => {
        this.setColdefs();
        this.getRows();
      },
      error => {
        console.error('Error loading data:', error);
      }
    );
  }


      getRows () {
        let paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        this.apiService.apiPost(this.path, paging).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.PartnerName = this.partners.find((item => item.Id === items.PartnerId))?.Name;
                items.GameName = this.games.find((item => item.Id === items.GameId))?.Name;
                return items;
              });
              this.rowData =  mappedRows;
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
            }
          },
          );
      }

  setCoinsValue(params) {
    const row = params.data;
    // this.apiService.apiPost(this.updateSettingsPath, row).subscribe(data => {
    //   if (data.Code === 0) {
    //     SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
    //   } else {
    //     SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
    //   }
    // })
  }
  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async onAddEditCoin(editable: boolean) {
    const row = this.gridApi.getSelectedRows()[0];
    let coinData = {};
    if (editable) {
      coinData = { IsEdit: true, ...row };
    }

    const { AddEditCoinComponent } = await import('./add-edit-coin/add-edit-coin.component');
    const dialogRef = this.dialog.open(AddEditCoinComponent, {
      width: ModalSizes.SMALL,
      data: {
        coinData: coinData,
        partners: this.partners,
        games: this.games
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getRows();
    })
  }

  onDeleteCoin() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      SnackBarHelper.show(this._snackBar, { Description: "No coin selected", Type: "warning" });
      return;
    }
  
    this.isSendingReqest = true;
    const coin = selectedRows[0];
    const coinId = coin.Id;
    const currency = coin.CurrencyId;
  
    this.apiService.apiPost('common/removeCoin', { Id: coinId, CurrencyId: currency })
      .pipe(take(1))
      .subscribe({
        next: data => {
          if (data.ResponseCode === 0) {
            SnackBarHelper.show(this._snackBar, { Description: "Coin deleted successfully", Type: "success" });
            this.getRows();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            this.getRows();
          }
        },
        error: err => {
          SnackBarHelper.show(this._snackBar, { Description: "An error occurred while deleting the coin", Type: "error" });
          this.getRows();
        },
        complete: () => {
          this.isSendingReqest = false;
        }
      });
  }  

}
