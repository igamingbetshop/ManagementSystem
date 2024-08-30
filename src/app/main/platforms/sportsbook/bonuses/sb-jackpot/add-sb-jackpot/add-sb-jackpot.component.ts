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
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';


@Component({
  selector: 'add-sb-jackpot',
  templateUrl: './add-sb-jackpot.component.html',
  styleUrls: ['./add-sb-jackpot.component.scss'],
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
    DateTimePickerComponent
  ],
})
export class AddSBJackpotComponent implements OnInit {
  formGroup: UntypedFormGroup;
  jackpotTypes: any[] = [];
  partners: any[] = [];
  jackpot: any;
  selectedType;
  statuses = ACTIVITY_STATUSES;
  regions: any;
  isSendingRequest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { partners: any[], jackpotTypes: any[], jackpot: any },
    public dialogRef: MatDialogRef<AddSBJackpotComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) {
  }

  ngOnInit() {
    this.partners = this.data.partners;
    this.jackpotTypes = this.data.jackpotTypes;
    this.jackpot = this.data.jackpot;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [this.jackpot.Id],
      Name: [this.jackpot.Name, [Validators.required]],
      PartnerId: [this.jackpot.PartnerId],
      Type: [1],
      Amount: [this.jackpot.Amount],
      WinAmount: [this.jackpot.WinAmount],
      BetPercent: [this.jackpot.BetPercent],
      WinnerBetId: [this.jackpot.WinnerBetId],
      MinAmount: [this.jackpot.MinAmount],
      MaxAmount: [this.jackpot.MaxAmount],
      CreationTime: [this.jackpot.CreationTime],
      LastUpdateTime: [this.jackpot.LastUpdateTime],
      Status: [this.jackpot.Status],
    });

  }

  get errorControl() {
    return this.formGroup?.controls;
  }

  close() {
    this.dialogRef.close();
  }

  // changedType(event) {
  //   this.selectedType = event;

  //   console.log(this.selectedType, );
    
  //   if(this.selectedType === 3) {
  //     this.formGroup.controls['MinCoeff'].setValidators([Validators.required]);
  //   } else {
  //     this.formGroup.controls['MinCoeff'].clearValidators();
  //   } 
  // }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
  this.jackpot = this.formGroup.value;
  this.isSendingRequest = true;
    this.apiService.apiPost('bonuses/savejackpot', this.jackpot)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          this.isSendingRequest = false;
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }

}
