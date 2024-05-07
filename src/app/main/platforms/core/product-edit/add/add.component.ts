import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";



import { MatButtonModule } from "@angular/material/button";

import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelectModule } from '@angular/material/select';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { take } from 'rxjs';


@Component({
  selector: 'app-add',
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
  ],
})
export class AddComponent implements OnInit {
  formGroup: UntypedFormGroup;
  parentGroup;
  languages: any[] = [];
  isSendingReqest = false;


  message: string = '';

  constructor(public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private configService: ConfigService,
    private fb: UntypedFormBuilder) {
    this.formValues();
  }

  ngOnInit(): void {
    this.parentGroup = this.data?.Id ? this.data?.Name : '';
    this.languages = this.commonDataService.languages;

  }



  formValues() {
    this.formGroup = this.fb.group({
      LanguageId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Description: [null, [Validators.required]],
    });
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
    obj.ParentId = this.data?.Id ? this.data.Id : 1;
    obj.ProductId = 0;
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.PRODUCT, Methods.ADD_PRODUCT)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      });


  }

  get errorControl() {
    return this.formGroup?.controls;
  }

}
