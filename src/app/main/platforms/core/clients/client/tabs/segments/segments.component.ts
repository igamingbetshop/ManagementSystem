import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import 'ag-grid-enterprise';
import {Controllers, GridRowModelTypes, Methods} from "../../../../../../../core/enums";
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

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.scss']
})
export class SegmentsComponent implements OnInit {
  public clientId: number;
  public gridApi: GridApi;
  public cacheBlockSize:number = 100;
  public pageSizes = [100, 500, 1000, 2000, 5000];
  public defaultPageSize = 100;

  constructor(private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
  ) {
  }

  public rowData: any[];
  public rowData1;

  defaultColDef: ColDef[] = [

  ]

  public columnDefs: ColDef[] = [
    {
      headerName: 'Id',
      field: 'Id',
      resizable: true,
      cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Partner Name',
      field: 'PartnerName',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Name',
      field: 'Name',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Mode',
      field: 'Mode',
      resizable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Gender',
      field: 'Gender',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Is KYC Verified',
      field: 'IsKYCVerified',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Terms',
      field: 'IsTermsConditionAccepted',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Client Status',
      field: 'ClientStatus',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Affiliate Id',
      field: 'AffiliateId',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Bonus',
      field: 'Bonus',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Client Id',
      field: 'ClientId',
      resizable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Deposit Payment System',
      field: 'SuccessDepositPaymentSystem',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Email',
      field: 'Email',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'First Name',
      field: 'FirstName',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Last Name',
      field: 'LastName',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Mobile Code',
      field: 'MobileCode',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Region',
      field: 'Region',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Segment Id',
      field: 'SegmentId',
      resizable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Withdrawal Payment System',
      field: 'SuccessWithdrawalPaymentSystem',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Session Period',
      field: 'SessionPeriod',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'SignUp Period',
      field: 'SignUpPeriod',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Bets Count',
      field: 'TotalBetsCount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Sport Bets Count',
      field: 'SportBetsCount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Casino Bets Count',
      field: 'CasinoBetsCount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Bets Amount',
      field: 'TotalBetsAmount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Deposits Count',
      field: 'TotalDepositsCount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Deposits Amount',
      field: 'TotalDepositsAmount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Withdrawals Count',
      field: 'TotalWithdrawalsCount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Total Withdrawals Amount',
      field: 'TotalWithdrawalsAmount',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Complimentary Point',
      field: 'ComplimentaryPoint',
      resizable: true,
      filter: 'agTextColumnFilter',
    },
    // {
    //   headerName: 'View',
    //   cellRenderer: OpenerComponent,
    //   filter: false,
    //   valueGetter: params => {
    //     let data = {path: '', queryParams: null};
    //     let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
    //     data.path = this.router.url.replace(replacedPart, 'segment');
    //     data.queryParams = {segmentId: params.data.Id};
    //     return data;
    //   },
    //   sortable: false
    // },
  ];
  public autoGroupColumnDef: ColDef = {
    headerName: 'Group Id',
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

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getProductLimits();
  }

  onCellValueChanged(params) {
    const product = params.data.Settings;
    product.MaxLimit = params.newValue;
    const req = {
      Id: product.Id,
      MaxLimit: Number(product.MaxLimit) || null,
      ProductId: product.ProductId,
      ObjectId: this.clientId,
      ObjectTypeId: 2
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

  getProductLimits() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.UTIL, Methods.GET_CLIENT_PRODUCTS_LIMITS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData1 = data.ResponseObject
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {this.gridApi.setServerSideDatasource(this.createServerSideDatasource());}, 0);
  }

}
