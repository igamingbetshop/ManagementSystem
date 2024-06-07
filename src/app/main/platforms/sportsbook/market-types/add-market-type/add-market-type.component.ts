import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { take } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonDataService } from "../../../../../core/services";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { TranslateModule } from "@ngx-translate/core";


@Component({
  selector: 'app-add-market-type',
  templateUrl: './add-market-type.component.html',
  styleUrls: ['./add-market-type.component.scss']
})
export class AddMarketTypeComponent implements OnInit {

  formGroup: UntypedFormGroup;
  sports: any[] = [];
  partners: any[] = [];
  arr = [];
  selection = { SelectionTypeName: '', Priority: null };
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddMarketTypeComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,

  ) { }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      SportId: [null, [Validators.required]],
      MarketTypeName: [null, [Validators.required]],
      SuccessOutcomeCount: [null, [Validators.required]],
    });
    this.formGroup['SelectionTypes'] = [];
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  addSelectionType() {
    if (this.selection.SelectionTypeName && this.selection.Priority) {
      this.arr.push({ SelectionTypeName: this.selection.SelectionTypeName, Priority: this.selection.Priority });
      this.selection.SelectionTypeName = '';
      this.selection.Priority = null;
    }
  }

  delete(index) {
    this.arr.splice(index, 1);
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    obj.SelectionTypes = this.arr;

    this.apiService.apiPost('markettypes/addmarkettype', obj)
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
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ],
  declarations: [AddMarketTypeComponent]
})
export class AddMarketTypeModule {

}
