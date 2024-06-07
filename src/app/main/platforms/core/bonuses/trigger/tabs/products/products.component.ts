import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridApi, ColDef, CellValueChangedEvent, ICellRendererParams, ServerSideStoreType, IsServerSideGroup, GetServerSideGroupKey, GridReadyEvent } from 'ag-grid-community';
import { take } from 'rxjs';
import { GridRowModelTypes, Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { CoreApiService } from '../../../../services/core-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseGridComponent implements OnInit {
  public triggerId:any;
  private triggerItem: any;

  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,) {
    super(injector);
  }

  public rowData: any[];
  public columnDefs: ColDef[] = [
    {
      headerName: 'Common.Id',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Id', hide: true,
      filter: false,
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
      minWidth: 90,
      filter: false,
    },

  ];
  public autoGroupColumnDef: ColDef = {
    headerName: 'Common.GroupId',
    headerValueGetter: this.localizeHeader.bind(this),
    field: 'Id',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
    filter: false,
  };
  public rowModelType: GridRowModelTypes = GridRowModelTypes.SERVER_SIDE;

  ngOnInit() {
    this.triggerId = this.activateRoute.snapshot.queryParams.triggerId;
    this.getTriggerSettings();
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

    const requestBody = {
      Id: this.triggerItem.Id,
      Name: this.triggerItem.Name,
      Status: this.triggerItem.Status,
      Description:  this.triggerItem.Description,
      BonusSettingCodes: this.triggerItem.BonusSettingCodes,
      FinishTime: this.triggerItem.FinishTime,
      MaxAmount: this.triggerItem.MaxAmount,
      MinAmount: this.triggerItem.MinAmount,
      PartnerId: this.triggerItem.PartnerId,
      StartTime: this.triggerItem.StartTime,
      Type:  this.triggerItem.Type,
      Products: [product],
    };

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.BONUS, Methods.SAVE_TRIGGER_SETTING)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          const products = data.ResponseObject.Products;
          for (let i = 0; i < products.length; i++) {
            if (products[i].ProductId == params.data.Id) {
              params.data.Settings = products[i];
              break;
            }
            SnackBarHelper.show(this._snackBar, { Description: "Done", Type: "success" });
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          params.data.Settings.Percent = params.oldValue;
        }
      });
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        const filter: any = {};
        filter.SkipCount = 0;
        filter.TakeCount = -1;
        // filter.BonusId = this.triggerItem.Id
        if (params.parentNode.level == -1) {
          filter.ProductId = 1;
        } else {
          filter.ParentId = params.parentNode.data.Id;
        }

        this.setFilter(params.request.filterModel, filter);

        this.apiService.apiPost(this.configService.getApiUrl, filter,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              this.mapProducts(data.ResponseObject.Entities);
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            }
          });
      },
    };
  }

  mapProducts = (products) => {
    products.forEach(product => {
      let settings = this.triggerItem.Products.find(p => p.ProductId == product.Id);
      if (!settings) {
        settings = { Id: 0, ProductId: product.Id, Percent: null, Lines: null, CoinValue: null, Coins: null };
      }
      product.Settings = settings;
      product.Percent = settings.Percent;
      product.Lines = settings.Lines;
      product.CoinValue = settings.CoinValue;
      product.Count = settings.Count;
      product.Coins = settings.Coins;
      product.group = !product.IsLeaf;
    });
  }

  private getTriggerSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: this.triggerId },
      true, Controllers.BONUS, Methods.GET_TRIGGER_SETTINGS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.triggerItem = data.ResponseObject.Entities[0];
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        }
      });
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier);
  }

}
