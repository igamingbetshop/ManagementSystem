import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService} from "../../../../../../../../core/services";
import {SkillGamesApiService} from "../../../../../services/skill-games-api.service";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-copy-website-settings',
  templateUrl: './copy-website-settings.component.html',
  styleUrls: ['./copy-website-settings.component.scss']
})
export class CopyWebsiteSettingsComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public partnerId;
  public partners;
  public partner;
  public menus = [];
  public selectedPartner;

  constructor(public dialogRef: MatDialogRef<CopyWebsiteSettingsComponent>,
              private activateRoute: ActivatedRoute,
              public apiService: SkillGamesApiService,
              private fb: UntypedFormBuilder,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data) {
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
      MenuItemId: [{value: null, disabled: true}, [Validators.required]]
    })
  }

  getWebsiteMenus() {
    this.apiService.apiPost('cms/websitemenus', {PartnerId: this.selectedPartner})
      .pipe(take(1))
      .subscribe(data => {

        if (data.ResponseCode === 0) {
          this.menus = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
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
        if (data.ResponseCode === 0) {
          this.menus = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

}
