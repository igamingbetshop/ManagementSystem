import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import { PoolBettingApiService } from 'src/app/main/platforms/sportsbook/services/pool-betting-api.service';
import { ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { PBControllers, PBMethods } from 'src/app/core/enums';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public partner;
  public partnerId: number;
  public partnerName;
  public formGroup: UntypedFormGroup;
  public states = [
    { Id: 1, Name: 'Active' },
    { Id: 2, Name: 'Blocked' }
  ]
  public isEdit = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private apiService: PoolBettingApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService
  ) {
  }

  ngOnInit() {
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.createForm();
    this.getPartner();
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

  getPartner() {
    this.apiService.apiPost(PBControllers.PARTNERS, '', { "Id": this.partnerId, })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.partner = data.ResponseObject[0];
          this.formGroup.patchValue(this.partner);
          this.partner.StateName = this.states.find(x => x.Id === this.partner.State).Name;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(PBControllers.PARTNERS, PBMethods.ADD, obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Partner successfully updated', Type: "success" });
          this.isEdit = false;
          this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

}
