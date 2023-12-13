import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogRef} from "@angular/material/dialog";
import {CommonDataService, ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { CoreApiService } from '../../services/core-api.service';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-categories.component.html',
  styleUrls: ['./create-categories.component.scss']
})
export class CreateCategoriesComponent implements OnInit {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateCategoriesComponent>,
    public commonDataService:CommonDataService,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {


     this.createForm();

  }



  public createForm(){

    this.formGroup = this.fb.group({
      Id:[null, [Validators.required]],
      NickName:[null, [Validators.required]],
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
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CLIENT, Methods.SAVE_CLIENT_CATEGORY).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.dialogRef.close(data.ResponseObject);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });


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
  ],
  declarations: [CreateCategoriesComponent]
})
export class CreateUserModule
{

}