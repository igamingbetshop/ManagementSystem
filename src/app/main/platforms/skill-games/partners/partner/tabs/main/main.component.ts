import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../core/services";
import {SkillGamesApiService} from "../../../../services/skill-games-api.service";
import {take} from "rxjs/operators";
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
  public isEdit = false;

  constructor(private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              private _snackBar: MatSnackBar,
              public apiService: SkillGamesApiService,
              public configService: ConfigService) { }

  ngOnInit(): void {
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.createForm();
    this.getPartner();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      CurrencyId: [null],
      Name: [null],
    });
  }

  getPartner() {
    this.apiService.apiPost('partners', {"Id": this.partnerId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.partner = data.ResponseObject.Entities[0];
          this.formGroup.get('Id').setValue(this.partner['Id']);
          this.formGroup.get('Name').setValue(this.partner['Name']);
          this.formGroup.get('CurrencyId').setValue(this.partner['CurrencyId']);
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
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, {Description : 'Partner successfully updated', Type : "success"});
          this.isEdit = false;
          this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }



}
