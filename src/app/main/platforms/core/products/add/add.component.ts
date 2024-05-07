import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../services/core-api.service';
import { take } from 'rxjs';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-product',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
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
export class AddComponent implements OnInit {
  formGroup: UntypedFormGroup;
  gameProviderId: number;
  languages: any[] = [];
  gameProviders: any[] = [];
  productStates: any[] = [];
  parentProductName;
  parentId;
  isSendingReqest = false; 
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    private apiService: CoreApiService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameProviders: any[];
      productStates: any, languages:
      any, parentProductName: any,
      parentId: any,
      partnerId: any
    },
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder) {
      this.formValues();
  }

  ngOnInit(): void {
    this.languages = this.data.languages;
    this.productStates = this.data.productStates;
    this.parentProductName = this.data.parentProductName;
    this.fetchProviders();
  }

  fetchProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gameProviders = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
          this.findId();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: 'error'});
        }
      });
  }

  findId() {
    const name = this.parentProductName?.split(" ").join('');
    this.gameProviderId = this.gameProviders.find((partner) => partner.Name == name)?.Id;
    if(this.gameProviderId){
      this.formGroup.get('GameProviderId').setValue(this.gameProviderId);
    }
  }

  formValues() {
    this.formGroup = this.fb.group({
      LanguageId: [null,[Validators.required]],
      Id: [null,[Validators.required,Validators.min(1)]],
      GameProviderId: [null,[Validators.required]],
      Name: [null,[Validators.required]],
      Description: [null,[Validators.required]],
      ParentId: [this.data.parentId],
      State: [null,[Validators.required]],
      ExternalId: [null],
      IsForMobile: [false],
      IsForDesktop: [false],
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
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.PRODUCT, Methods.ADD_PRODUCT)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(obj);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
        this.isSendingReqest = false;

      });

  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
