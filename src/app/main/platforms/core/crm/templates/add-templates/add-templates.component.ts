import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CoreApiService } from '../../../services/core-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-crm-templates',
  templateUrl: './add-templates.component.html',
  styleUrls: ['./add-templates.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class AddTemplatesComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partners: any[] = [];
  types: any[] = [];
  isSendingReqest = false; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {partners: any[], types: any[]},
    public dialogRef: MatDialogRef<AddTemplatesComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:CoreApiService,
    private configService: ConfigService,
    public commonDataService:CommonDataService,
  ) { }

  ngOnInit() {

    this.partners = this.data.partners;
    this.types = this.data.types;

     this.createForm();
  }

  public createForm(){
    this.formGroup = this.fb.group({
      NickName:[null,[Validators.required]],
      PartnerId:[null,[Validators.required]],
      ClientInfoType:[null,[Validators.required]],
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
    if(this.formGroup.invalid || this.isSendingReqest){
      return;
    }
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_MESSAGE_TEMPLATES)
      .pipe(take(1))
      .subscribe(data => {
        if(data.ResponseCode === 0){
          this.dialogRef.close(data.ResponseObject);
        }else{
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
        this.isSendingReqest = false;
    })
  }
}