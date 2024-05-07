import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { CoreApiService } from '../../../services/core-api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigService } from 'src/app/core/services';
import {Controllers, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-core-regions',
  templateUrl: './add-core-regions.component.html',
  styleUrls: ['./add-core-regions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FormsModule,
    MatDialogModule,
    TranslateModule
  ],
})
export class AddCoreRegionsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  languages: any[] = [];
  regions: any[] = [];
  parentId: number | undefined;
  isSendingReqest = false; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {Languages: any[],Regions: any[], parentId: number | undefined},
    public dialogRef: MatDialogRef<AddCoreRegionsComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.languages = this.data.Languages;
    this.regions = this.data.Regions;
    this.parentId = this.data.parentId;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Name:[null,[Validators.required]],
      IsoCode:[null],
      LanguageId:[null],
      TypeId:[null,[Validators.required]],
      State:[1],
      ParentId: [this.parentId ?? null],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.formGroup.invalid){
      return;
    }
    const request = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.REGION, Methods.SAVE_REGION)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
      });
  }
}
