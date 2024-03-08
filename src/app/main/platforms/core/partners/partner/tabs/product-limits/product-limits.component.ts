import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {Controllers, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../core/services";
import {
  CellValueChangedEvent,
  ColDef, GetServerSideGroupKey, GridApi, GridReadyEvent,
  ICellRendererParams, IsServerSideGroup,
  ServerSideStoreType,
} from "ag-grid-community";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-limits',
  templateUrl: './product-limits.component.html',
  styleUrls: ['./product-limits.component.scss']
})
export class ProductLimitsComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public partnerId;
  public partnerName;
  public gridApi: GridApi;
  public rowData: any[];
  public rowData1;
  public columnDefs: ColDef[] = [
    {field: 'Id', hide: true},
    {
      headerName: 'Common.Name',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Name',},
    {
      headerName: 'Products.ParentId',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'ParentId'},
    {
      headerName: 'Clients.MaxLimit',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'MaxLimit',
      editable: true,
      onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      cellEditor: 'numericEditor'
    },
  ];
  public defaultColDef: ColDef = {
    width: 240,
    editable: false,
    filter: 'agTextColumnFilter',
    flex: 1,
    minWidth: 50,
  };
  public autoGroupColumnDef: ColDef = {
    headerName: 'Common.GroupId',
    headerValueGetter: this.localizeHeader.bind(this),
    field: 'Id',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
  };
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public serverSideStoreType: ServerSideStoreType = 'partial';

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };
  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  constructor(private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              public dialog: MatDialog,
              private translate: TranslateService
              ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getClientProductsLimits();
  }

  onCellValueChanged(params) {
    const product = params.data.Settings;
    product.MaxLimit = params.newValue;
    const req = {
      Id: product.Id,
      MaxLimit: Number(product.MaxLimit) || null,
      ProductId: product.ProductId,
      ObjectId: this.partnerId,
      ObjectTypeId: 5
    }
    this.apiService.apiPost(this.configService.getApiUrl, req,
      true, Controllers.UTIL, Methods.SAVE_PRODUCT_LIMIT).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const products = data.ResponseObject;

        for (let i = 0; i < products.length; i++) {
          if (products[i].ProductId == params.data.Id) {
            params.data.MaxLimit = products[i];
            break;
          }
        }

      } else {
        params.data.MaxLimit = params.oldValue;
      }
    });
  }

  getClientProductsLimits() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId, true,
      Controllers.UTIL, Methods.GET_PARTNER_PRODUCTS_LIMITS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData1 = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {

        const filter: any = {};
        filter.SkipCount = 0;
        filter.TakeCount = -1;

        if (params.parentNode.level == -1) {
          filter.ProductId = 1;
        } else {
          filter.ParentId = params.parentNode.data.Id;
        }

        this.apiService.apiPost(this.configService.getApiUrl, filter,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            this.mapProducts(data.ResponseObject.Entities);
            params.success({rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count});
          }
        });
      },
    };
  }

  mapProducts = (products) => {
    products.forEach(product => {
      let settings = this.rowData1.find(p => p.ProductId == product.Id);
      if (!settings)
        settings = {Id: 0, ProductId: product.Id, Percent: null};

      product.Settings = settings;
      product.MaxLimit = settings.MaxLimit;
      product.group = !product.IsLeaf;
    });
  }

  async copyPartnerSettings() {
    const {CopySettingsComponent} = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier);
  }

}
