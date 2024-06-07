import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatInputModule } from "@angular/material/input";

import { MatSelectModule } from "@angular/material/select";

import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { MatButtonModule } from "@angular/material/button";

import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SportsbookApiService } from "../../services/sportsbook-api.service";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { take } from "rxjs/operators";

@Component({
  selector: 'app-add-setting',
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss'],
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
    MatCheckboxModule,
    MatDialogModule
  ],
})
export class AddSettingComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partners = [];
  marketTypes = [];
  sportId;
  sports = [];
  path: string = 'markettypes';
  filter = {
    "pageindex": 0,
    "pagesize": 100,
    SportIds: {},
  };
  isSendingReqest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { TeaserId: number },
    public dialogRef: MatDialogRef<AddSettingComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.getSports();
    this.formGroup = this.fb.group({
      CompetitionId: [null, [Validators.required]],
      MarketTypeId: [null, [Validators.required]],
      BasePoint: [null, [Validators.required]],
      SportId: [null, [Validators.required]],
      TeaserId: [this.data.TeaserId],
      Id: [0],
    });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    } else {
      const obj = this.formGroup.getRawValue();
      this.dialogRef.close(obj);
    }
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onSportChange(val) {
    this.sportId = val;
    this.getMarketTypes();
  }

  getMarketTypes() {
    if (this.sportId) {
      this.filter.SportIds = { IsAnd: true, ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }] }
    }
    this.apiService.apiPost(this.path, this.filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypes = data.ResponseObject.filter((market) => {
            if (this.sportId === market.SportId) {
              return market.ValueType == 1 || market.ValueType == 2
            }
          })
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}