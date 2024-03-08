import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {take} from "rxjs/operators";
import {MatButtonModule} from '@angular/material/button';

import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import {MatInputModule} from "@angular/material/input";



import { CoreApiService } from '../../../../services/core-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommModule } from '../../../../bonuses/commons/comm.module';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-copy-settings',
  templateUrl: './copy-settings.component.html',
  styleUrls: ['./copy-settings.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    TranslateModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class CopySettingsComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public partners = [];
  public menus = [];
  public selectedPartner;
  selectedValue = '';
  myLable: string;
  method: string;

  constructor(
    public dialogRef: MatDialogRef<CopySettingsComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.formValues();
      this.partners = this.commonDataService.partners;

      this.myLable = this.data.lable;
      this.method = this.data.method;
      this.formGroup.get('ToPartnerId').setValue(this.data.partnerId);

  }

  close() {
    this.dialogRef.close();
  }

  onChange(event) {
    if (event) {
      this.selectedPartner = event;
    }
  }

  private formValues() {
    this.formGroup = this.fb.group({
      FromPartnerId: [null, [Validators.required]],
      ToPartnerId: [null, [Validators.required]]
    })
  }

  onSubmit() {
    const requestBody = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true,
      Controllers.PARTNER, Methods[this.method] ).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }
}
