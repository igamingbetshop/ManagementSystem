import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-odd',
  templateUrl: './add-odd.component.html',
  styleUrls: ['./add-odd.component.scss'],
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
    TranslateModule,
    MatDialogModule
  ],
})
export class AddOddComponent implements OnInit {
  partners: any[] = [];
  partnerId = null;
  formGroup: UntypedFormGroup;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddOddComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getPartners();
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

  createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Coefficient: [null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isSendingReqest = true;
    this.apiService.apiPost('utils/addpermissibleodd', this.formGroup.value).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(true);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }


}