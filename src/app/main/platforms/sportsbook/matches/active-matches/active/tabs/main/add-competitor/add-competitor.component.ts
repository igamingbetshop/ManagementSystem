import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { AddConfigComponent } from 'src/app/main/platforms/core/partners/partner/tabs/web-site-settings/add-config/add-config.component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
})
export class AddCompetitor implements OnInit {

  formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddConfigComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      MatchId: [this.data],
      TeamId: [null, [Validators.required]],
      Display: [false, ],
    })
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('matches/addcompetitor', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
          this.dialogRef.close();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }

}
