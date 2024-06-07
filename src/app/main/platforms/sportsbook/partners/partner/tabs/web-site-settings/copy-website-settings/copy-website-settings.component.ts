import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonDataService, ConfigService } from "../../../../../../../../core/services";
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-copy-website-settings',
  templateUrl: './copy-website-settings.component.html',
  styleUrls: ['./copy-website-settings.component.scss'],
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
  ]
})
export class CopyWebsiteSettingsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partnerId;
  partners = [];
  menus = [];
  selectedPartner;
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<CopyWebsiteSettingsComponent>,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private apiService: SportsbookApiService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partners = this.commonDataService.partners;
    this.formValues();
  }

  close() {
    this.dialogRef.close();
  }

  onChange(event) {
    if (event) {
      this.selectedPartner = event;
      this.formGroup.get('MenuItemId').enable();
      this.getWebsiteMenus();
    }
  }

  private formValues() {
    this.formGroup = this.fb.group({
      FromPartnerId: [null, [Validators.required]],
      MenuItemId: [{ value: null, disabled: true }]
    })
  }

  getWebsiteMenus() {
    this.apiService.apiPost('cms/getwebsitemenus', { PartnerId: this.selectedPartner, DeviceType: this.data.deviceType, })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.menus = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.isSendingReqest = true;
    const setting = this.formGroup.getRawValue();
    setting.ToPartnerId = +this.partnerId;
    this.apiService.apiPost('cms/clonewebsitemenubypartnerId', setting)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.menus = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

}
