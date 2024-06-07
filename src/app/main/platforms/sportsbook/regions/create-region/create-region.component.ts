import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-region',
  templateUrl: './create-region.component.html',
  styleUrls: ['./create-region.component.scss'],
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
    MatDialogModule
  ]
})
export class CreateRegionComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<CreateRegionComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) { }

  ngOnInit() {
    this.createForm();

  }

  public createForm() {
    this.formGroup = this.fb.group({
      Name: [null, [Validators.required]],
      IsoCode: [null, [Validators.required]],
      Enabled: [true],
      Priority: [null, [Validators.required]],
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
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('regions/add', obj).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

}
