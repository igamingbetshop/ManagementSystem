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
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonDataService, ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public states = [
    {Id: 1, Name: 'Active'},
    {Id: 2, Name: 'Blocked'}
  ]
  public currencies: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreatePartnerComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:SportsbookApiService,
    private commonDataService: CommonDataService,
  ) { }

  ngOnInit() {
    this.currencies = this.commonDataService.currencies;
     this.createForm();

  }

  public createForm(){
    this.formGroup = this.fb.group({
      Id:[null, [Validators.required]],
      Name:[null, [Validators.required]],
      CurrencyId:[null, [Validators.required]],
      State:[null, [Validators.required]],
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
    this.apiService.apiPost('partners/add', obj).pipe(take(1)).subscribe(data => {
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
    MatDialogModule
  ],
  declarations: [CreatePartnerComponent]
})
export class CreatePartnerModule
{

}

