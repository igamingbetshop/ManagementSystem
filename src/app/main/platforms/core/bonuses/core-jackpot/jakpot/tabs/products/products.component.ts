import { Component, Injector, OnInit, signal, Type } from '@angular/core';
import 'ag-grid-enterprise';
import {
  CellDoubleClickedEvent,
  CellValueChangedEvent,
  ColDef, GetServerSideGroupKey, GridApi,
  GridReadyEvent, ICellRendererParams,
  IsServerSideGroup,
} from "ag-grid-community";
import { debounceTime, take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { GridRowModelTypes, Controllers, Methods, ModalSizes } from 'src/app/core/enums';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseGridComponent implements OnInit {

  private jackpot: any;
  public modelChanged = new Subject<string>();
  public searchName = '';
  commonId = signal<number>(null);
  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
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
      filter: false,
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
    this.commonId.set(this.activateRoute.snapshot.queryParams.Id);
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
    return params.data.Percent ? Number(params.data.Percent) : percent;
  }

  onCellValueChanged(params) {
    let product = params.data.Settings;

    // Initialize the Settings object if it doesn't exist
    if (!product) {
        console.warn("Settings is undefined, initializing a new Settings object for:", params.data);
        product = {
            Id: 0,
            ProductId: params.data.Id,
            Percent: null,
        };
        params.data.Settings = product;
    }

    // Set the Percent value
    product.Percent = this.getPercentValue(params);

    const requestBody = {
        Id: this.jackpot.Id,
        Name: this.jackpot.Name,
        Type: this.jackpot.Type,
        Status: this.jackpot.Status,
        Products: [product],
    };

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.BONUS, Methods.SAVE_JACKPOTS)
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
        filter.BonusId = this.jackpot.Id;
        filter.Pattern = this.searchName;
        if (params.parentNode.level == -1) {
          filter.ProductId = 1;
        } else {
          filter.ParentId = params.parentNode.data.Id;
        }
        const modifiedFilterModel = { ...params.request.filterModel };

        this.setFilter(modifiedFilterModel, filter);
        this.apiService.apiPost(this.configService.getApiUrl, filter,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const enitities = this.getMappedProducts(data.ResponseObject.Entities);
              params.success({ rowData: enitities, rowCount: data.ResponseObject.Count });
            }
          });
      },
    };
  }

  getMappedProducts(entities: any) {
    entities.forEach(product => {
      let settings = this.jackpot.Products.find(p => p.ProductId == product.Id);
      if (!settings) {
        settings = { Id: 0, ProductId: product.Id, Percent: null, };
      }
      if (product.GameProviderId != null) {
        product.group = false;
      } else {
        product.group = !product.IsLeaf;
      }
      product.Percent = settings.Percent;
    });
    return entities;
  }

  private getBonusById() {
    const bonusId = this.route.snapshot.queryParams.Id;
    this.apiService.apiPost(this.configService.getApiUrl, { Id: bonusId },
      true, Controllers.BONUS, Methods.GET_JACKPOTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.jackpot = data.ResponseObject[0];
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        }
      });
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier);
  }



}
