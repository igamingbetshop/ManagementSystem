import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { take } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from "@ngx-translate/core";
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonDataService } from 'src/app/core/services';
import { VirtualGamesApiService } from '../../../services/virtual-games-api.service';

@Component({
  selector: 'app-add-edit-coin',
  templateUrl: './add-edit-coin.component.html',
  styleUrls: ['./add-edit-coin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ],

})
export class AddEditCoinComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  public isEdit = false;
  public path = 'common/addcoin'
  public partners: any[] = [];
  public games: any[] = [];
  public currencies: any[] = [];
  isSendingReqest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditCoinComponent>,
    private apiService: VirtualGamesApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private commonDataService: CommonDataService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getCurrencies();
    this.currencies = this.commonDataService.currencies;
    this.checkData();
    this.partners = this.data.partners;
    this.games = this.data.games;    
  }

  checkData() {
    if(this.data.coinData.IsEdit) {
      this.formGroup.patchValue(this.data.coinData);
      this.isEdit = true;
      this.path = 'utils/updatecoin'
      this.formGroup.controls.PartnerId.disable();
      this.formGroup.controls.GameId.disable();
      this.formGroup.controls.CurrencyId.disable();
      this.formGroup.controls.Value.markAsDirty();
    }
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null],
      GameId: [null, [Validators.required]],
      CurrencyId: [null, [Validators.required]],
      Value: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  getCurrencies() {
    this.apiService.apiPost("common/currencies")
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.currencies = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    let obj = this.formGroup.getRawValue();
    if (this.isEdit) {
      obj = {Id: this.data.coinData.Id, ...obj }
      this.path = 'common/updateCoin';
    }

    this.apiService.apiPost(this.path, obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  close() {
    this.dialogRef.close();
  }

}
