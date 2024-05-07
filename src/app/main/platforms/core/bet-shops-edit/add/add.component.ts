import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";

import { MatFormFieldModule } from "@angular/material/form-field";

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { MatSelectModule } from '@angular/material/select';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreApiService } from '../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-bet-shop',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class AddComponent implements OnInit {
  formGroup: UntypedFormGroup;
  parentGroupName;
  isParentGroup;
  partners: any[] = [];
  message: string = '';
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private apiService: CoreApiService,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: { parentGroup: any, partners: any },
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.isParentGroup = !this.data.parentGroup?.Id;
    this.parentGroupName = this.isParentGroup ? '' : this.data.parentGroup?.Name;
    this.partners = this.data.partners;
    this.formValues();

  }

  formValues() {
    this.formGroup = this.fb.group({
      Id: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      AnonymousBet: [null],
      AllowCashout: [null],
      AllowLive: [null],
      UsePin: [null],
      MaxCopyCount: [null],
      MaxWinAmount: [null],
      MinBetAmount: [null],
      MaxEventCountPerTicket: [null],
      CommissionType: [null],
      CommisionRate: [null],
    });
    if (!this.isParentGroup) {
      this.formGroup.get(["Id"]).removeValidators([Validators.required]);
      this.formGroup.get(["Id"]).updateValueAndValidity();
    }
  }

  close() {
    this.dialogRef.close();
  }



  submit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = obj.Id || this.data.parentGroup.PartnerId;
    obj.ParentId = this.isParentGroup ? null : this.data.parentGroup.Id;
    delete obj.Id;

    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.BET_SHOP, Methods.SAVE_BET_SHOP_GROUPS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(obj);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });

  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
