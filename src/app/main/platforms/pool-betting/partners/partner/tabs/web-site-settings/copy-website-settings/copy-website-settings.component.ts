import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { PoolBettingApiService } from 'src/app/main/platforms/sportsbook/services/pool-betting-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { PBControllers, PBMethods } from 'src/app/core/enums';

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
  public formGroup: UntypedFormGroup;
  public partnerId;
  public partners = [];
  public menus = [];
  public selectedPartner;

  constructor(public dialogRef: MatDialogRef<CopyWebsiteSettingsComponent>,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private apiService: PoolBettingApiService,
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
    this.apiService.apiPost(PBControllers.PARTNERS, PBMethods.WEBSITE_MENUS, { PartnerId: this.selectedPartner, DeviceType: this.data.deviceType, })
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
      });
  }

}
