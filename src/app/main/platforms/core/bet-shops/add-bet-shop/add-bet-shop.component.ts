import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";

import {MatButtonModule} from "@angular/material/button";


import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectModule} from '@angular/material/select';
import {CoreApiService} from '../../services/core-api.service';
import {CommonDataService, ConfigService} from 'src/app/core/services';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {Controllers, Methods} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-add-bet-shop',
  templateUrl: './add-bet-shop.component.html',
  styleUrls: ['./add-bet-shop.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class AddBetShopComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  public betShopStates: any[] = [];
  public currencies: any[] = [];
  private betId: string;

  constructor(
    public dialogRef: MatDialogRef<AddBetShopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { betshopstates: any, productStates: any, lenguges: any, parentProductName: any, parentId: any },
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    private configService: ConfigService,
    private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.betShopStates = this.data.betshopstates;
    this.currencies = this.commonDataService.currencies;
    this.betId = this.activateRoute.snapshot.queryParams.BetId;
    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      CurrencyId: [null, [Validators.required]],
      CurrentLimit: [null, [Validators.required]],
      DefaultLimit: [null, [Validators.required]],
      BonusPercent: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Address: [null, [Validators.required]],
      State: [null, [Validators.required]],
      GroupId: [this.betId, [Validators.required]],
      PrintLogo: [false],
      AnonymousBet: [null],
      AllowCashout: [null],
      AllowLive: [null],
      UsePin: [null],
      MaxCopyCount: [null],
      MaxWinAmount: [null],
      MinBetAmount: [null],
      MaxEventCountPerTicket: [null],
      CommissionType: [null],
      CommisionRate: [null],

    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const requestBody = this.formGroup.getRawValue();

    this.apiService.apiPost(this.configService.getApiUrl, requestBody,
      true, Controllers.BET_SHOP, Methods.SAVE_BET_SHOP)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }

      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
