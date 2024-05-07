import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";

import { MatFormFieldModule } from "@angular/material/form-field";

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { MatButtonModule } from "@angular/material/button";


import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelectModule } from '@angular/material/select';

import { CommonDataService } from 'src/app/core/services';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreApiService } from '../../../services/core-api.service';


@Component({
  selector: 'app-add-shop',
  templateUrl: './add-shop.component.html',
  styleUrls: ['./add-shop.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
  ],

})
export class AddShopComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  public cashdeskStates: any[] = [];
  public currencies: any[] = [];
  public cashdesktypes = [{ Id: 1, Name: "Cashier" }, { Id: 2, Name: "Client" }, { Id: 3, Name: "Terminal" }];
  public restrictions = [
    { Id: 1, Name: 'Pre-Ticket' },
    { Id: 2, Name: 'Customer Card' },
    { Id: 3, Name: 'Anonymus' },
  ];

  constructor(public dialogRef: MatDialogRef<AddShopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cashdeskstates: any, },
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.cashdeskStates = this.data.cashdeskstates;

    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      Name: [null, [Validators.required]],
      State: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      MacAddress: [null, [Validators.required]],
      EncryptionKey: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      Restrictions: [null],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.dialogRef.close(obj);
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
