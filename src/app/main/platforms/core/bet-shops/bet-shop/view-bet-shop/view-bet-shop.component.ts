import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {Controllers, Methods} from 'src/app/core/enums';
import {CommonDataService, ConfigService} from 'src/app/core/services';
import {CoreApiService} from '../../../services/core-api.service';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-bet-shop',
  templateUrl: './view-bet-shop.component.html',
  styleUrls: ['./view-bet-shop.component.scss']
})
export class ViewBetShopComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public cashdesktypes = [{Id: 1, Name: "Cashier"}, {Id: 2, Name: "Client"}, {Id: 3, Name: "Terminal"}];
  public name: string;
  public secondName: string;
  public cashDesk;
  public viewId;
  public betId;
  public betSopeId;
  public cashdeskStates: any[] = [];
  public isEdit = false;
  public restrictions  = [
    { Id: 1, Name: 'Pre-Ticket' },
    { Id: 2, Name: 'Customer Card' },
    { Id: 3, Name: 'Anonymus' },
  ];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              private fb: UntypedFormBuilder,
              private router: Router
  ) {
  }

  ngOnInit() {
    this.name = this.activateRoute.snapshot.queryParams.Name;

    this.betId = this.activateRoute.snapshot.queryParams.BetId;
    this.betSopeId = this.activateRoute.snapshot.queryParams.betShopId;
    this.secondName = this.activateRoute.snapshot.queryParams.secondName;
    this.viewId = this.activateRoute.snapshot.queryParams.viewId;
    this.formValues();
    this.getCashdeskStates();
  }

  getCashdeskStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_CASH_DESKS_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.cashdeskStates = data.ResponseObject;
          this.getCahsdeskById();

        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  getCahsdeskById() {
    this.apiService.apiPost(this.configService.getApiUrl, {Id: this.viewId},
      true, Controllers.BET_SHOP, Methods.GET_CASH_DESKS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.cashDesk = data.ResponseObject.Entities[0];
          this.cashDesk.StateName = this.cashdeskStates?.find(p => p.Id == this.cashDesk.State).Name;
          this.formGroup.patchValue(this.cashDesk);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  formValues() {
    this.formGroup = this.fb.group({
      Name: [null, [Validators.required]],
      Id: [null],
      BetShopId: [null],
      State: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      MacAddress: [null, [Validators.required]],
      EncryptionKey: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      Restrictions: [null],

    });
    this.formGroup.get(['Id']).disable();
    this.formGroup.get(['BetShopId']).disable();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.Balance = this.cashDesk.Balance;

    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.BET_SHOP, Methods.SAVE_CASH_DESK).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.isEdit = false;
        SnackBarHelper.show(this._snackBar, {Description: 'Success', Type: "success"});
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  toRedirectToBetshops() {
    this.router.navigate(['/main/platform/bet-shop-groups/bet-shops/all-bet-shops'], {
      queryParams: { "BetId": this.betId, "Name": this.name, }
    });
  };

  redirectToBetshop() {
    this.router.navigate(['/main/platform/bet-shop-groups/bet-shops/bet-shop'], {
      queryParams: { "BetId": this.betId, "Name": this.name, "betShopId": this.betSopeId, "secondName": this.secondName }
    });
  }


}
