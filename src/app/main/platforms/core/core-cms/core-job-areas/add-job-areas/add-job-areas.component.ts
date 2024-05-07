import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreApiService } from '../../../services/core-api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigService } from 'src/app/core/services';
import { take } from 'rxjs';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';




@Component({
  selector: 'app-add-core-comment-type',
  templateUrl: './add-job-areas.component.html',
  styleUrls: ['./add-job-areas.component.scss'],
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
    MatCheckboxModule,
    MatDialogModule
  ],
})
export class AddCoreJobAreasComponent implements OnInit {
  formGroup: UntypedFormGroup;
  isSendingReqest = false;
  constructor(
    public dialogRef: MatDialogRef<AddCoreJobAreasComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.createForm();
  }


  public createForm() {
    this.formGroup = this.fb.group({
      Info: [null],
      NickName: ['', [Validators.required]],
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
    const obj = this.formGroup.getRawValue();
    
    this.apiService.apiPost(this.configService.getApiUrl,obj,
      true, Controllers.CONTENT, Methods.SAVE_JOB_AREA)
      .pipe(take(1))
      .subscribe(data => {
        if(data.ResponseCode === 0){
        this.dialogRef.close(obj);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });

  }

}