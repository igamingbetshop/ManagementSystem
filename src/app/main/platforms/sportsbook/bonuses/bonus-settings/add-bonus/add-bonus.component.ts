import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";


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
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class AddBonusComponent implements OnInit {
  formGroup: UntypedFormGroup;
  bonusTypes: any[] = [];
  bonusChannels: any[] = [];
  partners: any[] = [];
  bonus: any;
  openForAdd;
  selectedType;
  path = 'regions';
  regions: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { partners: any[], bonusTypes: any[], bonusChannels: any[], bonus: any },
    public dialogRef: MatDialogRef<AddBonusComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) {
  }

  ngOnInit() {
    this.partners = this.data.partners;
    this.bonusTypes = this.data.bonusTypes;
    this.bonusChannels = this.data.bonusChannels;
    this.bonus = this.data.bonus;
    this.openForAdd = !!this.bonus.Id;
    this.createForm();
    this.getRegions();
  }

  getRegions() {
    this.apiService.apiPost(this.path, { Type: 5 }).subscribe(data => {
      if (data.Code === 0) {
        this.regions = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [this.bonus.PartnerId],
      TypeId: [this.bonus.TypeId, [Validators.required]],
      ChannelId: [this.bonus.ChannelId],
      CountryCode: [this.bonus.CountryCode],
      Name: [this.bonus.Name, [Validators.required]],
      SelectionsMinCount: [this.bonus.SelectionsMinCount, [Validators.required]],
      SelectionsMaxCount: [this.bonus.SelectionsMaxCount],
      BonusPercent: [this.bonus.BonusPercent],
      MinTotalCoeff: [this.bonus.MinTotalCoeff],
      MinCoeff: [this.bonus.MinCoeff],
      MaxAmount: [this.bonus.MaxAmount],
      MinAmount: [this.bonus.MinAmount],
      State: [true],
      ExternalId: [this.bonus.ExternalId],
      TurnoverCount: [this.bonus.TurnoverCount],
      MaxTotalCoeff: [this.bonus.MaxTotalCoeff],
    });
    if (this.openForAdd) {
      this.formGroup.controls?.['TypeId'].disable();
      this.formGroup.controls?.['ChannelId'].disable();
      this.formGroup.controls?.['SelectionsMinCount'].disable();
      this.formGroup.controls?.['SelectionsMaxCount'].disable();
      this.formGroup.controls?.['BonusPercent'].disable();
      this.formGroup.controls?.['MinCoeff'].disable();
      this.formGroup.controls?.['MinTotalCoef'].disable();
    }

  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  changedType(event) {
    this.selectedType = event;

    console.log(this.selectedType, );
    
    if(this.selectedType === 3) {
      this.formGroup.controls['MinCoeff'].setValidators([Validators.required]);
    } else {
      this.formGroup.controls['MinCoeff'].clearValidators();
    } 
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.bonus.PartnerId = this.formGroup.get('PartnerId').value;
    this.bonus.Name = this.formGroup.get('Name').value;
    this.bonus.ChannelId = this.formGroup.get('ChannelId').value;
    this.bonus.CountryCode = this.formGroup.get('CountryCode').value;
    this.bonus.TypeId = this.formGroup.get('TypeId').value;
    this.bonus.SelectionsMinCount = this.formGroup.get('SelectionsMinCount').value;
    this.bonus.SelectionsMaxCount = this.formGroup.get('SelectionsMaxCount').value;
    this.bonus.BonusPercent = this.formGroup.get('BonusPercent').value;
    this.bonus.MinCoeff = this.formGroup.get('MinCoeff').value;
    this.bonus.MinTotalCoeff = this.formGroup.get('MinTotalCoeff').value;
    this.bonus.State = this.formGroup.get('State').value;
    this.bonus.MaxAmount = this.formGroup.get('MaxAmount').value;
    this.bonus.MinAmount = this.formGroup.get('MinAmount').value;
    this.bonus.ExternalId = this.formGroup.get('ExternalId').value;
    this.bonus.MaxTotalCoeff = this.formGroup.get('MaxTotalCoeff').value;
    delete this.bonus.LanguageId;

    this.apiService.apiPost(this.bonus.Id ? 'bonuses/updatebonussetting' : 'bonuses/addbonussetting', this.bonus)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }

}
