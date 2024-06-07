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
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";


@Component({
  selector: 'app-clone-role',
  templateUrl: './add-bonus.component.html',
  styleUrls: ['./add-bonus.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class AddBonusComponent implements OnInit {
  formGroup: UntypedFormGroup;
  bonusSettings: any[] = [];
  partners: any[] = [];
  bonus: any;
  openForAdd;
  isSendingReqest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {partners: any[], bonusSettings: any[],   bonus: any },
    public dialogRef: MatDialogRef<AddBonusComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:SportsbookApiService,

  ) { }

  ngOnInit() {
    this.partners = this.data.partners;
    this.bonusSettings = this.data.bonusSettings.filter((bon) => {
      return bon.TypeId === 3;
    });
    this.bonus = this.data.bonus;
    this.openForAdd = !!this.bonus.Id;
    this.createForm();
  }

  public createForm(){

    this.formGroup = this.fb.group({
      PartnerId:[this.bonus.PartnerId],
      BonusSettingId:[this.bonus.BonusSettingId,[Validators.required]],
      State:[this.bonus.State],
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
    this.isSendingReqest = true;
    this.bonus.PartnerId = this.formGroup.get('PartnerId').value;
    this.bonus.BonusSettingId = this.formGroup.get('BonusSettingId').value;
    this.bonus.State = this.formGroup.get('State').value;

    this.apiService.apiPost(this.bonus.Id ? 'bonuses/updatemultiplecashbackbonus' : 'bonuses/addmultiplecashbackbonus', this.bonus)
      .pipe(take(1))
      .subscribe(data => {
        if(data.Code === 0){
          this.dialogRef.close(data.ResponseObject);
        }else{
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
        this.isSendingReqest = false;
      })

  }

}