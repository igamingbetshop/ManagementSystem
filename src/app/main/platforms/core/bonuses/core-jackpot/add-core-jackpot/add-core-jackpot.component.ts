import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';
import { CoreApiService } from '../../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { ConfigService } from 'src/app/core/services';
import { JACKPOT_TYPE_STATUSES } from '../core-jackpot.component';


@Component({
  selector: 'add-core-jackpot',
  templateUrl: './add-core-jackpot.component.html',
  styleUrls: ['./add-core-jackpot.component.scss'],
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
    MatDialogModule,
    DateTimePickerComponent,
  ],
})
export class AddCoreJackpotComponent implements OnInit {
  formGroup: UntypedFormGroup;
  jackpotTypes: any[] = [];
  partners: any[] = [];
  typeStatuses = JACKPOT_TYPE_STATUSES;
  regions: any;
  isSendingRequest = false;
  selectedType: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { partners: any[], jackpotTypes: any[] },
    public dialogRef: MatDialogRef<AddCoreJackpotComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private configService: ConfigService,
    private apiService: CoreApiService,
  ) {
  }

  ngOnInit() {
    this.partners = this.data.partners;
    this.jackpotTypes = this.data.jackpotTypes;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [0],
      Name: [null, [Validators.required]],
      PartnerId: [null],
      Type: [2],
      Amount: [null, [Validators.required]],
      FinishTime: [null, [Validators.required]],
      RightBorder: [0],
      LeftBorder: [0]
    });

  }

  onTypeChange(event) {
    this.selectedType = event.value;
    if (event.value === 1) {
      this.formGroup.get('RightBorder').setValidators([Validators.required]);
      this.formGroup.get('LeftBorder').setValidators([Validators.required]);
    } else {
      this.formGroup.get('RightBorder').clearValidators();
      this.formGroup.get('LeftBorder').clearValidators();
    }
    this.formGroup.get('RightBorder').updateValueAndValidity();
    this.formGroup.get('LeftBorder').updateValueAndValidity();
  }

  get errorControl() {
    return this.formGroup?.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const jackpot = this.formGroup.value;
    this.isSendingRequest = true;
    this.apiService.apiPost(this.configService.getApiUrl, jackpot, true, Controllers.BONUS, Methods.SAVE_JACKPOTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          this.isSendingRequest = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }

}
