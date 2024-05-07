import {Component, Inject, OnInit} from '@angular/core';
import {CoreApiService} from "../../../services/core-api.service";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Controllers, Methods} from "../../../../../../core/enums";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {ConfigService} from "../../../../../../core/services";

@Component({
  selector: 'app-general-setup',
  templateUrl: './settle-bet-modal.component.html',
  styleUrls: ['./settle-bet-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SettleBetModalComponent implements OnInit {

  formGroup: UntypedFormGroup;
  selectedRowId: number;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<SettleBetModalComponent>,
    private apiService: CoreApiService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) private data: number) {
  }

  ngOnInit(): void {
    this.formValues();
    this.selectedRowId =  this.data;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const winAmount = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    const requestBody = {
      BetDocumentId: this.selectedRowId,
      ...winAmount
    };

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true,
      Controllers.REPORT, Methods.SETTLE_BET).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false; 
    });
  }

  private formValues() {
    this.formGroup = this.fb.group({
      WinAmount: [null],
    })
  }

}
