import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { take } from 'rxjs/operators';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-competition-category',
  templateUrl: './create-competition-category.component.html',
  styleUrls: ['./create-competition-category.component.scss'],
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
export class CreateCompetitionCategoryComponent implements OnInit {

  sports: any[] = [];
  formGroup: UntypedFormGroup;
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<CreateCompetitionCategoryComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:SportsbookApiService,
  ) { }

  ngOnInit() {
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
      PartnerId:[null],
      Name:[null, [Validators.required]],
      SportId:[null, [Validators.required]],
      AbsoluteLimit:[null, [Validators.required]],
      LiveDelay:[null, [Validators.required]],
      MaxWinPrematchSingle:[null],
      MaxWinPrematchMultiple:[null],
      MaxWinLiveSingle:[null],
      MaxWinLiveMultiple:[null],
      IsDefault:[false],
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
    this.isSendingReqest = true; 
    this.apiService.apiPost('competitions/addcategory', obj).pipe(take(1)).subscribe(data => {
      if(data.Code === 0)
      {
        this.dialogRef.close(data);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false; 
    });
  }

}