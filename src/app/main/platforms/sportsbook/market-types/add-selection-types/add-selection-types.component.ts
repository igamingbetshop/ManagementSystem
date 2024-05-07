import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-selection',
  templateUrl: './add-selection-types.component.html',
  styleUrls: ['./add-selection-types.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule
  ],
})
export class AddSelectionTypesComponent implements OnInit {
  public formGroup: UntypedFormGroup;



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {Id: number},
    public dialogRef: MatDialogRef<AddSelectionTypesComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:SportsbookApiService,

  ) { }

  ngOnInit() {

     this.createForm();

  }

  public createForm(){
    this.formGroup = this.fb.group({
      SelectionTypeName:[null,[Validators.required]],
      Priority:[null],
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
    const id = this.data.Id;
    const obj = this.formGroup.getRawValue();
    obj['MarketTypeId'] = id;
    this.apiService.apiPost('markettypes/addselectiontype', obj).pipe(take(1)).subscribe(data => {
      if(data.Code === 0)
      {
        this.dialogRef.close(data.ResponseObject);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
