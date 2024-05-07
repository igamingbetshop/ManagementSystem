import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {GridRowModelTypes} from "../../../../../../../core/enums";
import {AgGridAngular} from "ag-grid-angular";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public player;
  public playerId: number;
  public formGroup: UntypedFormGroup;
  public Categories: any[] = [];
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public isEdit = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    protected injector: Injector
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Users.User',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'User',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.UserFirstName !== null || params.data.UserLastName !== null) {
            a.innerHTML = params.data.UserFirstName + ' ' + params.data.UserLastName;
          }
          return a;
        },
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
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.CategoryName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.DelayBetweenBetsPrematch',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayBetweenBetsPrematch',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.DelayBetweenBetsLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayBetweenBetsLive',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.LimitPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LimitPercent',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.DelayPercentPrematch',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayPercentPrematch',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.DelayPercentLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayPercentLive',
        sortable: true,
        resizable: true,
      },
    ]
  }

  ngOnInit() {
    this.apiService.apiPost('players/categories')
      .pipe(take(1))
      .subscribe(data => {

        if (data.Code == 0) {
          this.Categories = data.Categories;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
    this.playerId = +this.activateRoute.snapshot.queryParams.playerId;
    this.createForm();
    this.getPlayer();
    this.getObjectChangeHistory();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  public createForm() {

    this.formGroup = this.fb.group({
      Id: [{value: null, disabled: true}],
      CategoryId: [null, [Validators.required]],
      ExternalId: [{value: null, disabled: true}],
      NickName: [{value: null, disabled: true}],
      PlayerCurrencyId: [{value: null, disabled: true}],
      Description: [null],
      LimitPercent: [null],
      DelayPercentPrematch: [null],
      DelayPercentLive: [null],
      DelayBetweenBetsPrematch: [null],
      DelayBetweenBetsLive: [null],
      RestrictMaxBet: [null],
      RepeatBetMaxCount: [null],
    });
  }

  getPlayer() {
    this.apiService.apiPost('players/player', {"Id": this.playerId,})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.player = data;
          this.formGroup.get('Id').setValue(this.player['Id']);
          this.formGroup.get('NickName').setValue(this.player['NickName']);
          this.formGroup.get('ExternalId').setValue(this.player['ExternalId']);
          this.formGroup.get('PlayerCurrencyId').setValue(this.player['PlayerCurrencyId']);
          this.formGroup.get('CategoryId').setValue(this.player['CategoryId']);
          this.formGroup.get('LimitPercent').setValue(this.player['LimitPercent']);
          this.formGroup.get('DelayPercentPrematch').setValue(this.player['DelayPercentPrematch']);
          this.formGroup.get('DelayPercentLive').setValue(this.player['DelayPercentLive']);
          this.formGroup.get('DelayBetweenBetsPrematch').setValue(this.player['DelayBetweenBetsPrematch']);
          this.formGroup.get('DelayBetweenBetsLive').setValue(this.player['DelayBetweenBetsLive']);
          this.formGroup.get('Description').setValue(this.player['Description']);
          this.formGroup.get('RestrictMaxBet').setValue(this.player['RestrictMaxBet']);
          this.player.CategoryName = this.Categories.find(item => item.Id === this.player.CategoryId)?.Name
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  getObjectChangeHistory() {
    this.apiService.apiPost('common/objectchangehistory', {ObjectId: String(this.playerId), ObjectTypeId: 22})
      .pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject.map((items) => {
          items.Object = JSON.parse(items.Object);
          items.CategoryName = this.Categories.find((item) => {
            return item.Id === items.Object.CategoryId;
          }).Name;
          items.LimitPercent = items.Object.LimitPercent;
          items.DelayPercentPrematch = items.Object.DelayPercentPrematch;
          items.DelayPercentLive = items.Object.DelayPercentLive;
          items.DelayBetweenBetsPrematch = items.Object.DelayBetweenBetsPrematch;
          items.DelayBetweenBetsLive = items.Object.DelayBetweenBetsLive;
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
    this.apiService.apiPost('players/update', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, {Description : 'Player successfully updated', Type : "success"});
          this.isEdit = false;
          this.getPlayer();
          this.getObjectChangeHistory();
          //this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

  mapData(res) {
    let data = JSON.parse(res);
    return data;
  }

}
