import { Component, Injector, OnInit, signal, WritableSignal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { DatePipe } from '@angular/common';
import { IMarketType } from '../../../../market-types/martet-type.interface'
import { MARKET_TYPE_STATUSES } from '../../../market-type-common/market-type-statuses';

@Component({
  selector: 'app-market-type-main',
  templateUrl: './market-type-main.component.html',
  styleUrls: ['./market-type-main.component.scss']
})
export class MarketTypeMainComponent extends BaseGridComponent implements OnInit {
  partnerId: number;
  marketTypeId: number;
  marketEntity: WritableSignal<IMarketType | null> = signal<IMarketType | null>(null);
  statuses = MARKET_TYPE_STATUSES;
  partnerName;
  formGroup: UntypedFormGroup;
  isEdit = false;
  rowData: WritableSignal<[]> = signal<[]>(null);
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
    this.createForm();
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
        field: 'Object.Color',
      },
      {
        headerName: 'Clients.CombinationalNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.CombinationalNumber',
      },
      {
        headerName: 'Clients.DisplayType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.DisplayType',
      },
      {
        headerName: 'Clients.GroupIds',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.GroupIds',
      },
      {
        headerName: 'Clients.IsForFilter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.IsForFilter',
        cellRenderer: (params: { value: any; }) => {
          const stateId = params.value;
          const stateObject = this.statuses?.find((state) => state.Id === stateId);
          if (stateObject) {
            return stateObject.Name;
          }
          return params.value;
        },

      },
      {
        headerName: 'Clients.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.Priority',
      },
      {
        headerName: 'Clients.ResultTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.ResultTypeId',
      },
      {
        headerName: 'Clients.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.Enabled',
      },

    ]
  }

  ngOnInit() {
    this.marketTypeId = +this.activateRoute.snapshot.queryParams.marketTypeId;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getMarketTypeById();
    this.getObjectChangeHistory();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      Name: [null],
      SportId: [null],
      SportName: [null],
      GroupIds: [null],
      CombinationalNumber: [null],
      Enabled: [null],
      Priority: [null],
      Color: [null],
      LineNumber: [null],
      TranslationId: [null],
      ValueType: [null],
      DisplayType: [null],
      IsForFilter: [null],
      ResultTypeId: [null],
      MatchPhaseId: [null],
      SelectionsCount: [null],
      SuccessOutcomeCount: [null],
      PartnerSetting: [null],
      Selections: [null],
    });
  }


  getMarketTypeById() {
    if (this.marketTypeId) {
      this.filter.Ids = { IsAnd: true, ApiOperationTypeList: [{ IntValue: this.marketTypeId, OperationTypeId: 1 }] }
    }
    this.filter.PartnerId = this.partnerId;
    this.apiService.apiPost(this.path, this.filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketEntity.set(data.ResponseObject[0]);
          this.formGroup.patchValue(data.ResponseObject[0]);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }


  getObjectChangeHistory() {
    this.apiService.apiPost('common/objectchangehistory', { ObjectId: String(this.marketTypeId), ObjectTypeId: 6 })
      .pipe(take(1)).subscribe((data) => {


        if (data.Code === 0) {
          this.rowData.set(data.ResponseObject.map((items) => {
            items.Object = JSON.parse(items.Object);

            items.LimitPercent = items.Object.LimitPercent;
            return items
          }));
        }
      })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
      this.apiService.apiPost('markettypes/update', obj).subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
          this.marketEntity.set(data.ResponseObject);
          this.formGroup.patchValue(data.ResponseObject);
          this.isEdit = false;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
    }
    

}
