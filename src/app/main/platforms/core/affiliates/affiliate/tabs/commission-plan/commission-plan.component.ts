import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";

import { take } from "rxjs/operators";
import { AgGridAngular } from "ag-grid-angular";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { DateAdapter } from "@angular/material/core";
import { CellValueChangedEvent, GridReadyEvent, ServerSideStoreType } from 'ag-grid-community';
import { ColDef, GetServerSideGroupKey, ICellRendererParams, IsServerSideGroup } from 'ag-grid-enterprise';

import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { Controllers, GridRowModelTypes, Methods } from "../../../../../../../core/enums";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-commission-plan',
  templateUrl: './commission-plan.component.html',
  styleUrls: ['./commission-plan.component.scss']
})
export class CommissionPlanComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid2') agGrid2: AgGridAngular;
  affiliateId: number;
  affiliate: any;
  countries = [];
  currencies: any[] = [];
  isEdit = false;
  public formGroup: UntypedFormGroup;
  public formGroupFixedFee: UntypedFormGroup;
  public formGroupDeposit: UntypedFormGroup;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public serverSideStoreType: ServerSideStoreType = 'partial';
  FixedFeeCommission: any;
  DepositCommission: any;

  public columnDefs = [];
  public defaultColDef: ColDef = {
    width: 240,
    editable: false,
    filter: 'agTextColumnFilter',
    flex: 1,
  };
  public filteredData;
  currences = [];

  public autoGroupColumnDef: ColDef = {
    headerName: 'Id',
    field: 'Id',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
  };
  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };

  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  public validationState = [
    { Name: "None", State: null },
    { Name: "Yes", State: true },
    { Name: "No", State: false },
  ];

  public frameworkComponents = {
    numericEditor: NumericEditorComponent,
  };

  constructor(private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,

    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      { field: 'Id', hide: true },
      { field: 'Name', },
      {
        headerName: 'Turnover Percent',
        field: 'Settings.Percent',

        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event, "Turnover"),
        cellEditor: 'numericEditor'
      },
      {
        headerName: 'GGR Percent',
        field: 'GGRSettings.Percent',
        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event, "GGR"),
        cellEditor: 'numericEditor'
      },
    ];
  }

  ngOnInit() {
    this.affiliateId = this.activateRoute.snapshot.queryParams.affiliateId;
    this.currencies = this.commonDataService.currencies;
    this.createForm();
    this.getAffiliate();
  }

  getAffiliate() {
    this.apiService.apiPost(this.configService.getApiUrl, this.affiliateId,
      true, Controllers.AFFILIATES, Methods.GET_AFFILIATE_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.affiliate = data.ResponseObject;
          if (this.affiliate?.FixedFeeCommission) {
            this.formGroupFixedFee.patchValue(this.affiliate.FixedFeeCommission);
          }
          if (this.affiliate?.DepositCommission) {
            this.formGroupDeposit.patchValue(this.affiliate.DepositCommission);
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  createForm() {

    this.formGroupFixedFee = this.fb.group({
      CurrencyId: [null],
      Amount: [null, Validators.pattern(/\-?\d*\.?\d{1,2}/)],
      TotalDepositAmount: [null, Validators.pattern(/\-?\d*\.?\d{1,2}/)],
      RequireVerification: [null],
    });

    this.formGroupDeposit = this.fb.group({
      CurrencyId: [null],
      Percent: [null, Validators.pattern(/\-?\d*\.?\d{1,2}/)],
      UpToAmount: [null, Validators.pattern(/\-?\d*\.?\d{1,2}/)],
      DepositCount: [null],
    });
  }

  get errorControl() {
    return this.formGroup?.controls;
  }

  onCellValueChanged(params, column) {
    const product = params.data;
    let req = []
    let body;
    product.Percent = params.data.Percent;
    product.TurnoverPercent = params.data.TurnoverPercent;
    if (column == "Turnover") {
      req = [{
        ProductId: product.Id,
        Percent: Number(product.Settings.Percent),
      }]
      body = { TurnoverCommission: req }
    } else if (column == "GGR") {
      req = [{
        ProductId: product.Id,
        Percent: Number(product.GGRSettings.Percent),
      }]
      body = { GGRCommission: req }
    }

    this.apiService.apiPost(this.configService.getApiUrl,
      {
        AffiliateId: this.affiliateId,
        ...body
      },
      true, Controllers.AFFILIATES, Methods.UPDATE_COMMISSION_PLAN).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          const products = data.ResponseObject;
          for (let i = 0; i < products.length; i++) {
            if (products[i].ProductId == params.data.Id) {
              params.data.Percent = products[i];
              params.data.TurnoverPercent = products[i];
              break;
            }
          }
        } else {
          params.data.Percent = params.oldValue;
          params.data.PercentTurnoverPercent = params.oldValue;
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

        this.apiService.apiPost(this.configService.getApiUrl, filter, true, Controllers.PRODUCT, Methods.GET_PRODUCTS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const products = this.getMapProducts(data.ResponseObject.Entities);
              params.success({
                rowData: products,
                rowCount: data.ResponseObject.Count
              });
            }
          });

      },
    };
  }

  getMapProducts(products) {
    products.forEach(product => {
      let settings;
      if (this.affiliate?.TurnoverCommission) {
        settings = this.affiliate.TurnoverCommission.find(p => p.ProductId == product.Id);
        product['Settings'] = settings;
        product.group = !product.IsLeaf;
      }
      if (!settings) {
        settings = { ProductId: product.Id, Percent: null };
        product.Settings = settings;
        product.MaxLimit = settings.MaxLimit;
        product.group = !product.IsLeaf;
      }
      let GGRSettings;
      if (this.affiliate?.GGRCommission) {
        GGRSettings = this.affiliate.GGRCommission.find(p => p.ProductId == product.Id);
        product['GGRSettings'] = GGRSettings
        product.GGRMaxLimit = 1;
        product.group = !product.IsLeaf;
      }

      if (!GGRSettings) {
        GGRSettings = { ProductId: product.Id, Percent: null };
        product.GGRSettings = GGRSettings;
        product.GGRMaxLimit = GGRSettings.MaxLimit;
        product.group = !product.IsLeaf;
      }
    });

    return products;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onSubmit() {
    const fixedFeeCommission = this.formGroupFixedFee.getRawValue();
    const depositCommission = this.formGroupDeposit.getRawValue();

    this.apiService.apiPost(this.configService.getApiUrl, {
      AffiliateId: this.affiliateId,
      FixedFeeCommission: fixedFeeCommission,
      DepositCommission: depositCommission
    },
      true, Controllers.AFFILIATES, Methods.UPDATE_COMMISSION_PLAN).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'The Affiliate has been updated successfully', Type: "success" });
          this.isEdit = false;
          this.getAffiliate();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCancel() {
    this.isEdit = false;
    this.getAffiliate();
  }
}


