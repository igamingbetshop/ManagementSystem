import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

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
    {Id: 1, Name: 'Active'},
    {Id: 2, Name: 'Blocked'}
  ]
  public isEdit = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private apiService: SportsbookApiService,
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
    this.apiService.apiPost('partners', {"Id": this.partnerId,})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.partner = data.ResponseObject[0];
          this.formGroup.get('Id').setValue(this.partner['Id']);
          this.formGroup.get('Name').setValue(this.partner['Name']);
          this.formGroup.get('State').setValue(this.partner['State']);
          this.formGroup.get('CurrencyId').setValue(this.partner['CurrencyId']);
          this.formGroup.get('RestrictMaxBet').setValue(this.partner['RestrictMaxBet']);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
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
          this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

}
