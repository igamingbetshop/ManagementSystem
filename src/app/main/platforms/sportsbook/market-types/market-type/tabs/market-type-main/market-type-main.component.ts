import {Component, Injector, OnInit, signal} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { DatePipe } from '@angular/common';
import {IMarketType} from '../../../../market-types/martet-type.interface'

@Component({
  selector: 'app-market-type-main',
  templateUrl: './market-type-main.component.html',
  styleUrls: ['./market-type-main.component.scss']
})
export class MarketTypeMainComponent extends BaseGridComponent implements OnInit {
  public partnerId: number;
  public marketTypeId: number;
  marketEntyty = signal<any>(null);
  public partnerName;
  public formGroup: UntypedFormGroup;
  public states = [
    {Id: 1, Name: 'Active'},
    {Id: 2, Name: 'Blocked'}
  ]
  public isEdit = false;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  filter = {
    PageIndex: 0,
    PageSize: 5000,
    Ids: {},
    PartnerId: undefined,
  };
  path: string = 'markettypes';

  constructor(
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    protected injector: Injector
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserFirstName',
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserLastName',
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
      },
      {
        headerName: 'Clients.Object',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object',
      },
      {
        headerName: 'Clients.ObjectId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectId',
      },
    ]
  }

  ngOnInit() {
    this.marketTypeId = +this.activateRoute.snapshot.queryParams.marketTypeId;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getMarketTypeById();
    // this.createForm();
    this.getObjectChangeHistory();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  public createForm() {

    this.formGroup = this.fb.group({
      Id: [null],
      CurrencyId: [null],
      State: [null, [Validators.required]],
      Name: [null],
      RestrictMaxBet: [null],
    });
  }

  getMarketTypeById() {
    if (this.marketTypeId) {
      this.filter.Ids = { IsAnd: true, ApiOperationTypeList: [{ IntValue: this.marketTypeId, OperationTypeId: 1 }] }
    }
    this.filter.PartnerId = this.partnerId;

    console.log(this.filter, "filter");
    
    this.apiService.apiPost(this.path, this.filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          
          this.marketEntyty.set(data.ResponseObject[0]);
          console.log(this.marketEntyty(), "MARKET TYPE DATA");

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }


  getObjectChangeHistory() {
    this.apiService.apiPost('common/objectchangehistory', { ObjectId: String(this.marketTypeId), ObjectTypeId: 6 })
      .pipe(take(1)).subscribe((data) => {
        console.log(data, "data");
        
        if (data.Code === 0) {
          this.rowData = data.ResponseObject.map((items) => {
            // items.Object = JSON.parse(items.Object);
            // items.CategoryName = this.Categories.find((item) => {
            //   return item.Id === items.Object.CategoryId;
            // }).Name;
            // items.LimitPercent = items.Object.LimitPercent;
            // items.DelayPercentPrematch = items.Object.DelayPercentPrematch;
            // items.DelayPercentLive = items.Object.DelayPercentLive;
            // items.DelayBetweenBetsPrematch = items.Object.DelayBetweenBetsPrematch;
            // items.DelayBetweenBetsLive = items.Object.DelayBetweenBetsLive;
            // items.RepeatBetMaxCount = items.Object.RepeatBetMaxCount;
            // items.RestrictMaxBet = items.Object.RestrictMaxBet;
            // items.AllowCashout = items.Object.AllowCashout;
            return items
          });
        }
      })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('partners/update', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, {Description : 'Partner successfully updated', Type : "success"});
          this.isEdit = false;
          // this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

}
