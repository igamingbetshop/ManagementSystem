import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { CommonDataService, ConfigService } from "../../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss'],
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class AddKeyComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public partnerId;
  public fromDate = new Date();
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddKeyComponent>,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    private apiService: SportsbookApiService,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.formValues();
  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.isSendingReqest = true;
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    setting.Type = this.data.type;
    this.apiService.apiPost('partners/savepartnerkey', setting)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })
  }

  close() {
    this.dialogRef.close();
  }

  private formValues() {
    this.formGroup = this.fb.group({
      Name: [null],
      NumericValue: [null],
      StringValue: [null],
      DecimalValue: [null],
      BooleanValue: [false],
      DateValue: [this.fromDate],
    })
  }

  onStartDateChange(event) {
    this.formGroup.get('DateValue').setValue(event.value);
  }

}
