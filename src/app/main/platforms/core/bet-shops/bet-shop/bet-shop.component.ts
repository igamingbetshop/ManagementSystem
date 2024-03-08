import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import 'ag-grid-enterprise';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Controllers, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { ServerCommonModel } from 'src/app/core/models/server-common-model';

@Component({
  selector: 'app-bet-shop',
  templateUrl: './bet-shop.component.html',
  styleUrls: ['./bet-shop.component.scss']
})
export class BetShopComponent extends BasePaginatedGridComponent implements OnInit {

  public betShopStates: any[] = [];
  public name: string;
  public betId;
  public betShopeId;
  public betShop: any;
  public states: any[] = [];
  public groups: any[] = [];
  public regions: any[] = [];
  public cashdeskStates: any[] = [];
  public cashdesktypes = [{ Id: 1, Name: "Cashier" }, { Id: 2, Name: "Client" }, { Id: 3, Name: "Terminal" }];
  public formGroup: UntypedFormGroup;
  public rowData = [];
  public filter: any = {};
  public isEdit = false;
  public countries: ServerCommonModel[] = [];
  public allCountries;
  public cities: ServerCommonModel[] = [];
  public allCities: ServerCommonModel[] = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public statuses = [
    { Name: `Yes`, Id: true },
    { Name: `No`, Id: false },
    { Name: `None`, Id: null },
  ]
  public paymentSystems: any = [];
  public paymentSystemsEntites = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
    public dialog: MatDialog,
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
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'BetShops.MacAddress',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MacAddress',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StateName',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },

      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = '/main/platform/bet-shop-groups/bet-shops/view-bet-shop';
          data.queryParams = { viewId: params.data.Id, secondName: this.betShop.Name };
          return data;
        },
        sortable: false
      },


    ];
  }

  ngOnInit() {
    this.gridStateName = 'core-bet-shop-grid-state';
    this.getBetShopStatesEnum();
    this.getRegions();
    this.getCashdeskStates();
    this.name = this.activateRoute.snapshot.queryParams.Name;
    this.betId = this.activateRoute.snapshot.queryParams.BetId;
    this.betShopeId = +this.activateRoute.snapshot.queryParams.betShopId;
    this.createForm();
    this.getBetshopById();
  }

  getCashdeskStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_CASH_DESKS_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.cashdeskStates = data.ResponseObject;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  featchPaymentSystems(currencyId, partnerId) {
    if (this.paymentSystems.length > 0) {
      this.setPaymentSystemsEntytes(this.betShop?.PaymentSystems);
      return;
    }
    const data = {
      CurrencyId: currencyId,
      PartnerId: partnerId,
    };
    this.apiService.apiPost(this.configService.getApiUrl, data, true, Controllers.PAYMENT,
      Methods.GET_PARTNER_PAYMENT_SETTINGS).pipe(take(1)).subscribe((data) => {
        this.paymentSystems = this.setUnicItems(data.ResponseObject);
        this.setPaymentSystemsEntytes(this.betShop?.PaymentSystems);
      });
  }

  setUnicItems(arr) {
    return Array.from(new Set(arr.map(item => item.PaymentSystemId)))
      .map(paymentSystemId => arr.find(item => item.PaymentSystemId === paymentSystemId));
  }

  setPaymentSystemsEntytes(elements) {
    this.paymentSystemsEntites = [];
    this.paymentSystemsEntites.push(elements?.map(elem => {
      return this.paymentSystems.find((item) => elem == item.PaymentSystemId)?.PaymentSystemName
    }))
  }

  getBetShopStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_BET_SHOP_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betShopStates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  private getRegions() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: null }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.allCountries = data.ResponseObject;
          this.allCountries.forEach(r => {
            if (r.TypeId === 3) {
              this.allCities.push(r);
            } else if (r.TypeId === 5) {
              this.countries.push(r);
            }
          });
        }
      });
  }

  public onCountryChange(event) {
    this.cities = this.allCities.filter(c => c.ParentId === event.value);
    this.formGroup.get('CountryId').setValue(event.value);
  }

  public onCityChange(event) {
    this.formGroup.get('RegionId').setValue(event.value);
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  getBetshopById() {
    this.apiService.apiPost(this.configService.getApiUrl, this.betShopeId,
      true, Controllers.BET_SHOP, Methods.GET_BET_SHOP_BY_ID)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.betshop.CashDeskModels.map(obj => {
            obj.StateName = this.betShopStates.find((item => item.Id === obj.State))?.Name;
            obj.TypeName = this.cashdesktypes.find((item => item.Id === obj.Type))?.Name;
            return obj;
          })
          this.betShop = data.ResponseObject.betshop;
          this.featchPaymentSystems(this.betShop.CurrencyId, this.betShop.PartnerId);
          this.states = data.ResponseObject.states;
          this.groups = data.ResponseObject.groups;
          let datePipe = new DatePipe("en-US");
          let CreationTime = this.betShop['CreationTime'];
          let LastUpdateTime = this.betShop['LastUpdateTime'];
          let creat = datePipe.transform(CreationTime, 'medium');
          let last = datePipe.transform(LastUpdateTime, 'medium');

          this.formGroup.patchValue(this.betShop);

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      CurrencyId: { value: null, disabled: true },
      CurrentLimit: { value: null, disabled: true },
      DefaultLimit: [null, [Validators.required]],
      PartnerName: { value: null, disabled: true },
      GroupId: [null, [Validators.required]],
      BonusPercent: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Address: [null, [Validators.required]],
      State: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      RegionId: [null],
      CreationTime: [null],
      LastUpdateTime: [null],
      AgentId: [null],
      PrintLogo: [false],
      AnonymousBet: [null],
      AllowCashout: [null],
      AllowLive: [null],
      PaymentSystems: [null],
      UsePin: [null],
    });
  }

  async AddCashDesk() {
    const { AddShopComponent } = await import('./add-shop/add-shop.component');
    const dialogRef = this.dialog.open(AddShopComponent, {
      width: ModalSizes.MEDIUM,
      data: { cashdeskstates: this.cashdeskStates, }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        data.BetShopId = this.betShopeId;
        this.apiService.apiPost(this.configService.getApiUrl, data,
          true, Controllers.BET_SHOP, Methods.SAVE_CASH_DESK)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.rowData.unshift(data.ResponseObject);
              this.gridApi.setRowData(this.rowData);
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.StateName = this.states.find(state => { return state.Id == obj.State })?.Name;
    obj.GroupName = this.groups.find(group => { return group.Id == obj.GroupId })?.Name;
    obj.Id = this.betShopeId;
    obj.CashDeskModels = [];


    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.BET_SHOP, Methods.SAVE_BET_SHOP).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.getBetshopById();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  toRedirectToBetshops() {
    this.router.navigate(['/main/platform/bet-shop-groups/bet-shops/all-bet-shops'], {
      queryParams: { "BetId": this.betId, "Name": this.name, }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

}
