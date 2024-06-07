import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
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
import { SportsbookApiService } from '../../../services/sportsbook-api.service';

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
  public path = 'utils/addcoin'
  public partners: any[] = [];
  public currencies: any[] = [];
  isSendingReqest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      Id: number | string,
      CurrencyId: string,
      PartnerId: number,
      Value: number ,
      IsEdit: boolean
    },
    public dialogRef: MatDialogRef<AddEditCoinComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private commonDataService: CommonDataService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getPartners();
    this.currencies = this.commonDataService.currencies;
    this.checkData();
  }

  checkData() {
    if(this.data.IsEdit) {
      this.formGroup.patchValue(this.data);
      this.isEdit = true;
      this.path = 'utils/updatecoin'
      this.formGroup.controls.PartnerId.disable();
      this.formGroup.controls.CurrencyId.disable();
      this.formGroup.controls.Value.markAsDirty();
    }
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      CurrencyId: [null, [Validators.required]],
      Value: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    let obj = this.formGroup.getRawValue();
    if (this.isEdit) {
      obj = {Id: this.data.Id, ...obj }
    }

    this.apiService.apiPost(this.path, obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data);
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
