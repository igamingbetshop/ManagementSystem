import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { take } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {CommonDataService} from "../../../../../core/services";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-add-comment-type',
  templateUrl: './add-market-type-group.component.html',
  styleUrls: ['./add-market-type-group.component.scss']
})
export class AddMarketTypeGroupComponent implements OnInit {

  formGroup: UntypedFormGroup;
  sports: any[] = [];
  partners: any[] = [];
  isSendingReqest = false;
  
  constructor(
    public dialogRef: MatDialogRef<AddMarketTypeGroupComponent>,
    private apiService:SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb:UntypedFormBuilder,
    public commonDataService:CommonDataService,
  ) { }

  ngOnInit() {
    this.apiService.apiPost('partners').subscribe(data => {
      if(data.Code === 0){
        this.partners = data.ResponseObject;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
    this.apiService.apiPost('sports').subscribe(data => {
      if(data.Code === 0){
        this.sports = data.ResponseObject;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
    this.createForm();
  }

  public createForm(){
    this.formGroup = this.fb.group({
      SportId:[null, [Validators.required]],
      PartnerId:[null,],
      Name:[null, [Validators.required]],
      Priority:[null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit()
  {
    if(this.formGroup.invalid){
      return;
    }
    const obj = this.formGroup.getRawValue();
     this.apiService.apiPost('markettypes/addmarkettypegroup', obj)
     .pipe(take(1))
     .subscribe(data => {
      if(data.Code === 0)
      {
        data.ResponseObject.PartnerId = obj.PartnerId;
        this.dialogRef.close(data);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  close(){
    this.dialogRef.close();
  }

}

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule,
      MatDialogModule
  ],
  declarations: [AddMarketTypeGroupComponent]
})
export class AddMarketTypeGroupModule
{

}
