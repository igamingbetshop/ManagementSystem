import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import 'ag-grid-enterprise';
import { DatePipe } from '@angular/common';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends BasePaginatedGridComponent implements OnInit {

  productStates: any[] = [];
  name: string;
  productId;
  currentProduct;
  formGroup: UntypedFormGroup;
  rowData = [];
  filter: any = {};
  isEdit = false;
  countries;
  countriesEntites = [];
  currencesEntites = [];
  currencies;
  productCategories = [];
  gameProviders = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    public activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,

    private fb: UntypedFormBuilder,
    protected injector: Injector,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: false,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: false,
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreatedBy',
        sortable: false,
        resizable: true,
        filter: false,
        cellRenderer: function (params) {
          return `${params.data.FirstName} ${params.data.LastName}`;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = '/main/platform/products/all-products/product/view-product';
          data.queryParams = { CommentId: params.data.Id };
          return data;
        },
        sortable: false
      },


    ];
  }

  ngOnInit() {
    this.gridStateName = 'core-product-grid-state';
    this.currencies = this.commonDataService.currencies;
    this.name = this.activateRoute.snapshot.queryParams.Name;
    this.productId = +this.activateRoute.snapshot.queryParams.ProductId;
    this.getProductStates();
    this.getProductCategories();
    this.getAllCountries();
    this.getGameProviders();
    this.createForm();
    this.setCurrencesEntites();

  }


  getGameProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gameProviders = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  getProductCategories() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.PRODUCT, Methods.GET_PRODUCT_CATEGORIES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.productCategories = data.ResponseObject;
        }
      });
  }

  getAllCountries() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countries = data.ResponseObject;
          this.getProduct();
        }
      });
  }

  getProductStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_PRODUCT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.productStates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  setCurrencesEntites() {
    this.currencesEntites.push(this.formGroup.value.Currencies?.Names?.map(elem => {
      return this.currencies.find((item) => elem === item.Id).Name
    }))
  }

  getProduct() {
    this.apiService.apiPost(this.configService.getApiUrl, this.productId,
      true, Controllers.PRODUCT, Methods.GET_PRODUCT_BY_ID)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.currentProduct = data.ResponseObject;
          this.getChangeHistory(this.currentProduct.Id);
          if (this.currentProduct.State) {
            this.currentProduct.StateName = this.productStates?.find(p => p.Id === this.currentProduct.State)?.Name;
          }
          this.formGroup.patchValue(this.currentProduct);
          if (this.currentProduct?.CategoryId) {
            this.currentProduct['CategoryName'] = this.productCategories.find(p => p.Id === this.currentProduct?.CategoryId).Name;
          }
          this.countriesEntites.push(this.currentProduct?.Countries.Ids.map(elem => {
            return this.countries?.find((item) => elem === item.Id)?.Name
          }))
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [{ value: this.productId, disabled: true },],
      Name: [null, [Validators.required]],
      Description: [null, [Validators.required]],
      ExternalId: [null, [Validators.required]],
      State: [null],
      GameProviderId: [null],
      IsForMobile: [null],
      IsForDesktop: [null],
      SubproviderId: [null],
      WebImageUrl: [null],
      MobileImageUrl: [null],
      BackgroundImageUrl: [null],
      ParentId: [null],
      HasDemo: [null],
      HasJackpot: [null],
      FreeSpinSupport: [null],
      CategoryId: [null],
      Comment: [null],
      MobileImage: [null],
      BackgroundImage: [null],
      WebImage: [null],
      BetValues: [null],
      Lines: [null],
      Countries: this.fb.group({
        Type: [null],
        Ids: [null],
      }),
      RTP: [null],
      Currencies: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.currentProduct?.Currencies.Type],
      }),
    });
  }

  getChangeHistory(id) {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: id, ObjectTypeId: 18 },
      true, Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  };

  uploadMobileImage(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('MobileImage').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
    }
  }

  uploadBackgroundImage(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('BackgroundImage').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
    }
  }

  uploadWebImage(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('WebImage').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.isEdit = false;
    this.formGroup.patchValue(this.currentProduct);
  }

  onNaviagetToProducts() {
    this.router.navigate(['/main/platform/products/all-products'])
    .then(() => {
      // Manually reload the page
      location.reload();
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.NewId = this.currentProduct.Id;
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.PRODUCT, Methods.EDIT_PRODUCTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.countriesEntites = [];
          this.getProduct();
          this.getChangeHistory(this.currentProduct.Id);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
