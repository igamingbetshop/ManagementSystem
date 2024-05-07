import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-market',
  templateUrl: './create-market.component.html',
  styleUrls: ['./create-market.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ],
})
export class CreateMarketComponent implements OnInit {

  public marketTypes: any[] = [];
  public formGroup: UntypedFormGroup;
  public sportId: number;
  public categoryId: number;
  private marketTypeIds: number[];

  constructor(
    public dialogRef: MatDialogRef<CreateMarketComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { marketTypeIds: number[] },
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    private activateRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.categoryId = +this.activateRoute.snapshot.queryParams.categoryId;
    this.marketTypeIds = this.data.marketTypeIds;
    this.getMarkettypes();
    this.createForm();
  }

  getMarkettypes() {
    const filterRequest = {
      SportIds: {
        ApiOperationTypeList: [{
          IntValue: this.sportId,
          OperationTypeId: 1
        }]
      }, pageindex: 0, pagesize: 500
    };

    this.apiService.apiPost('markettypes', filterRequest)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const filteredResponse = data.ResponseObject.filter(data => !this.marketTypeIds.includes(data.Id));
          this.marketTypes = filteredResponse.map(el => {
            return { Id: el.Id, Name: `${el.Name} - ${el.Id}` };
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      MarketTypeId: [null, [Validators.required]],
      AbsoluteProfitRange1: [null, [Validators.required]],
      AbsoluteProfitRange2: [null, [Validators.required]],
      AbsoluteProfitRange3: [null, [Validators.required]],
      AbsoluteProfitLive: [null, [Validators.required]],
      RelativeLimitRange1: [null, [Validators.required]],
      RelativeLimitRange2: [null, [Validators.required]],
      RelativeLimitRange3: [null, [Validators.required]],
      RelativeLimitLive: [null, [Validators.required]],
      AllowMultipleBets: [false],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = null;
    obj.CompetitionCategoryId = this.categoryId
    obj.CompetitionId = null;
    this.apiService.apiPost('competitions/createmarkettypeprofit', obj).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

}