import { Component, Injector, OnInit } from '@angular/core';
import 'ag-grid-enterprise';
import { Controllers, GridRowModelTypes, Methods } from "../../../../../../../core/enums";
import {
  CellValueChangedEvent,
  ColDef, GetServerSideGroupKey, GridApi,
  GridReadyEvent, ICellRendererParams,
  IsServerSideGroup,
} from "ag-grid-community";
import { debounceTime, take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

import { CoreApiService } from "../../../../services/core-api.service";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseGridComponent implements OnInit {
  private freeSpinBonusType = 14;
  private wagerCasinoBonusType = 10
  private bonusItem: any;
  public modelChanged = new Subject<string>();
  public searchName = '';

  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,) {
    super(injector);
  }

  public rowData: any[];
  public columnDefs: ColDef[] = [
    {
      headerName: 'Common.Id',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Id', hide: true
    },
    {
      headerName: 'Common.Name',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Name',
      filter: false,
    },
    {
      headerName: 'Bonuses.Percent',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Percent',
      editable: true,
      onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      filter: 'agNumberColumnFilter',
      minWidth: 90,
      filterParams: {
        buttons: ['apply', 'reset'],
        closeOnApply: true,
        filterOptions: this.filterService.numberOptions
      },
    },

  ];
  public autoGroupColumnDef: ColDef = {
    headerName: 'Common.GroupId',
    headerValueGetter: this.localizeHeader.bind(this),
    field: 'Id',
    filter: false,
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
  };
  public rowModelType: GridRowModelTypes = GridRowModelTypes.SERVER_SIDE;

  ngOnInit() {
    this.getBonusById();
    this.modelChanged.pipe(debounceTime(300)).subscribe(() => {
      this.gridApi.refreshServerSide({ purge: true });
    });
  }

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };

  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getPercentValue(params) {
    let percent;

    if (!!params.data.Lines || !!params.data.CoinValue || !!params.data.Coins) {
      percent = 0;
    } else {
      percent = null;
    }
    return params.data.Percent ? Number(params.data.Percent) : percent;
  }

  onCellValueChanged(params) {
    const product = params.data.Settings;
    product.Percent = this.getPercentValue(params);
    product.Lines = params.data.Lines ? Number(params.data.Lines) : null
    product.CoinValue = params.data.CoinValue ? Number(params.data.CoinValue) : null;
    product.Coins = params.data.Coins ? Number(params.data.Coins) : null;
    product.Count = params.data.Count ? Number(params.data.Count) : null;
    product.BetValueLevel = params.data.BetValueLevel ? Number(params.data.BetValueLevel) : null;

    const requestBody = {
      Id: this.bonusItem.Id,
      Name: this.bonusItem.Name,
      Status: this.bonusItem.Status,
      Products: [product],
    };

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.BONUS, Methods.UPDATE_BONUS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          const products = data.ResponseObject.Products;

          for (let i = 0; i < products.length; i++) {
            if (products[i].ProductId == params.data.Id) {
              params.data.Settings = products[i];
              break;
            }
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          params.data.Settings.Percent = params.oldValue;
        }
      });
  }

  inputChanged(event) {
    this.modelChanged.next(event);
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        const filter: any = {};
        filter.SkipCount = 0;
        filter.TakeCount = -1;
        filter.BonusId = this.bonusItem.Id;
        filter.Pattern = this.searchName;
        if (params.parentNode.level == -1) {
          filter.ProductId = 1;
        } else {
          filter.ParentId = params.parentNode.data.Id;
        }
        this.setFilter(params.request.filterModel, filter);
        this.apiService.apiPost(this.configService.getApiUrl, filter,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const enitities = this.getMappedProducts(data.ResponseObject.Entities);
              params.success({ rowData: enitities, rowCount: enitities.length });
            }
          });
      },
    };
  }

  getMappedProducts(entities: any) {
    entities.forEach(product => {
      let settings = this.bonusItem.Products.find(p => p.ProductId == product.Id);
      if (!settings) {
        settings = { Id: 0, ProductId: product.Id, Percent: null, Lines: null, CoinValue: null, Coins: null };
      }
      product.Settings = settings;
      product.Percent = settings.Percent;
      product.Lines = settings.Lines;
      product.CoinValue = settings.CoinValue;
      product.Count = settings.Count;
      product.Coins = settings.Coins;
      product.BetValueLevel = settings.BetValueLevel;
      product.group = !product.IsLeaf;
    });

    return entities;
  }

  private getBonusById() {
    const bonusId = this.route.snapshot.queryParams.commonId;
    this.apiService.apiPost(this.configService.getApiUrl, { BonusId: bonusId },
      true, Controllers.BONUS, Methods.GET_BONUS_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.bonusItem = data.ResponseObject;
          if (this.bonusItem.BonusTypeId == this.freeSpinBonusType ||
            this.bonusItem.BonusTypeId == this.wagerCasinoBonusType) {
            this.setColumnDefs();
          }
          if (this.bonusItem.BonusTypeId == this.freeSpinBonusType) {
            const index = this.columnDefs.findIndex(col => col.field == "Percent");
            if (index > -1)
              this.columnDefs.splice(index, 1);
          }
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        }
      });
  }

  setColumnDefs() {
    this.columnDefs.push(
      {
        headerName: 'Partners.Count',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Count',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.Lines',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Lines',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.CoinValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CoinValue',
        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.Coins',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coins',
        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Bonuses.BetValueLevel',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetValueLevel',
        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      }
    );
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier);
  }

}
