import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { take } from "rxjs/operators";

import { CoreApiService } from "../../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../../core/services";
import { Controllers, Methods } from "../../../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule
  ]
})
export class ConfirmDialogComponent implements OnInit {
  rowId;
  id;
  title;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.rowId = this.data.rowId;
    this.id = this.data.id
    this.title = this.data.name;

  }

  onSubmit() {
    const value = {
      rowId: this.rowId,
      id: this.id
    }
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PARTNER,
      Methods.DELETE_DNS_RECORD).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(value);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  onClose() {
    this.dialogRef.close();
  }

}
