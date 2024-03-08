import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PoolBettingApiService} from "../../services/pool-betting-api.service";
import {PBControllers, PBMethods} from "../../../../../core/enums";
import {MatInputModule} from "@angular/material/input";

import {TranslateModule} from "@ngx-translate/core";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";

import {MatIconModule} from "@angular/material/icon";
import {DateTimeHelper} from "../../../../../core/helpers/datetime.helper";

@Component({
  selector: 'app-add-round',
  templateUrl: './add-round.component.html',
  styleUrls: ['./add-round.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatDialogModule
  ]
})
export class AddRoundComponent implements OnInit {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddRoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: PoolBettingApiService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.formValues();
    this.getDate();
  }

  getDate() {
    DateTimeHelper.startDate();
    const fromDate = DateTimeHelper.getFromDate();
    const toDate = DateTimeHelper.getToDate();
    this.formGroup.get('OpenTime').setValue(fromDate);
    this.formGroup.get('CloseTime').setValue(toDate);
  }

  formValues() {
    this.formGroup = this.fb.group({
      MarketTypeId: [null, [Validators.required]],
      OpenTime: [null],
      CloseTime: [null],
      NickName: [null]
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const requestData = this.formGroup.getRawValue();
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.ADD_ROUND, requestData).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(data);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

}
