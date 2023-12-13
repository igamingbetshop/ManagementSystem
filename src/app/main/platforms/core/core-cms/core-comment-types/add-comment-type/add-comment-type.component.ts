import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreApiService } from '../../../services/core-api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigService } from 'src/app/core/services';


@Component({
  selector: 'app-add-core-comment-type',
  templateUrl: './add-comment-type.component.html',
  styleUrls: ['./add-comment-type.component.scss']
})
export class AddCoreCommentTypeComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public commentTypes: any[] = [];
  public partners: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {commentTypes: any[],partners: any[]},
    public dialogRef: MatDialogRef<AddCoreCommentTypeComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {

    this.commentTypes = this.data.commentTypes;
    this.partners = this.data.partners;

    this.createForm();

  }


  public createForm(){
    this.formGroup = this.fb.group({
      PartnerId:[null,[Validators.required]],
      Type:[null,[Validators.required]],
      NickName:[null,[Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close()
  {
    this.dialogRef.close();
  }

  onSubmit()
  {
    if(this.formGroup.invalid){
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.dialogRef.close(obj);
  }

}

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  declarations: [AddCoreCommentTypeComponent]
})
export class AddCoreCommentTypeModule
{

}

