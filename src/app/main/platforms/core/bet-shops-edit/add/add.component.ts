import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import { MatSelectModule } from '@angular/material/select';
import { CommonDataService } from 'src/app/core/services';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-bet-shop',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class AddComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public parentGroupName;
  public isParentGroup;
  public partners: any[] = [];
  message: string = '';

  constructor(public dialogRef: MatDialogRef<AddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { parentGroup: any, partners: any},
              public commonDataService:CommonDataService,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.isParentGroup = !this.data.parentGroup?.Id;
    this.parentGroupName = this.isParentGroup ? '' : this.data.parentGroup?.Name;
    this.partners = this.data.partners;
    this.formValues();

  }

  formValues() {
    this.formGroup = this.fb.group({
      Id: [null,[Validators.required]],
      Name: [null,[Validators.required]],
      AnonymousBet: [null],
      AllowCashout: [null],
      AllowLive: [null],
      UsePin: [null],
      MaxCopyCount: [null],
      MaxWinAmount: [null],
      MinBetAmount: [null],
      MaxEventCountPerTicket: [null],
      CommissionType: [null],
      CommisionRate: [null],
    });
    if(!this.isParentGroup){
      this.formGroup.get(["Id"]).removeValidators([Validators.required]);
      this.formGroup.get(["Id"]).updateValueAndValidity();
    }
  }

  close() {
    this.dialogRef.close();
  }



  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = obj.Id || this.data.parentGroup.PartnerId;
    obj.ParentId = this.isParentGroup ? null : this.data.parentGroup.Id;
    delete obj.Id;
    this.dialogRef.close(obj);
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
