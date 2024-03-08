import {Component, OnInit} from '@angular/core';
import 'ag-grid-enterprise';
import {Controllers, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
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
  selector: 'app-complimentary-point-rates',
  templateUrl: './complimentary-point-rates.component.html',
  styleUrls: ['./complimentary-point-rates.component.scss']
})
export class ComplimentaryPointRatesComponent implements OnInit {
  public partnerId;
  public partnerName;
  public gridApi: GridApi;
  public rowData = [];
  public complimentaryPointRates = [];
  public currencies = [];
  public currency;
  public currencyId;
  public columnDefs: ColDef[] = [
    {field: 'Id', hide: true},
    {
      headerName: 'Common.Name',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Name',},
    {
      headerName: 'Partners.Rate',
      field: 'Rate',
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
    headerName: 'Group Id',
    headerValueGetter: this.localizeHeader.bind(this),
    field: 'Id',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        // display employeeName rather than group key (employeeId)
        return params.data.Id;
      },
    },
  };
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public serverSideStoreType: ServerSideStoreType = 'partial';

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    // indicate if node is a group
    return dataItem.group;
  };
  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    // specify which group key to use
    return dataItem.Id;
  };

  constructor(private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              public commonDataService: CommonDataService,
              public dialog: MatDialog,
              private translate: TranslateService

  ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    // this.currency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.currencies = this.commonDataService.currencies;
    this.currency = this.currencies.find((cur) => cur.Id === 'USD').Id;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.getComplimentaryPointRates();
  }

  getComplimentaryPointRates() {
    this.apiService.apiPost(this.configService.getApiUrl, {PartnerId: this.partnerId, CurrencyId: this.currency}, true,
      Controllers.BONUS, Methods.GET_COMPLIMENTARY_POINT_RATES).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.complimentaryPointRates = data.ResponseObject;
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  onCellValueChanged(params) {
    const product = params.data.Settings;
    product.Rate = params.newValue;
    const req = {
      Id: product.Id,
      PartnerId: this.partnerId,
      Rate: product.Rate !== "" ? product.Rate : null,
      ProductId: product.ProductId,
      CurrencyId: this.currency,
    }

    this.apiService.apiPost(this.configService.getApiUrl, req,
      true, Controllers.BONUS, Methods.SAVE_COMPLIMENTARY_POINT_RATE).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const products = data.ResponseObject;

        for (let i = 0; i < products.length; i++) {
          if (products[i].ProductId == params.data.Id) {
            params.data.Rate = products[i];
            break;
          }
        }

      } else {
        params.data.Rate = params.oldValue;
      }
    });
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
      let settings = this.complimentaryPointRates.find(p => p.ProductId == product.Id);
      if (!settings)
        settings = {Id: 0, ProductId: product.Id, Rate: null};

      product.Settings = settings;
      product.Rate = settings.Rate;
      product.group = !product.IsLeaf;
    });
  }

  onCurrencyChange(event) {
    this.currency = event
    this.getComplimentaryPointRates();
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
