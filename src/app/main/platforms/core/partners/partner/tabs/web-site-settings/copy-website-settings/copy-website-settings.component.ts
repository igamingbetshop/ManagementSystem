import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-copy-website-settings',
  templateUrl: './copy-website-settings.component.html',
  styleUrls: ['./copy-website-settings.component.scss']
})
export class CopyWebsiteSettingsComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public partners = [];
  public menus = [];
  public selectedPartner;
  public partnerId;
  diviceType: any;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<CopyWebsiteSettingsComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,

    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.diviceType = this.data.diviceType;
    this.formValues();
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partners = this.commonDataService.partners;
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
      MenuItemId: [{value: null, disabled: true}]
    })
  }

  getWebsiteMenus() {
    const data = {
      PartnerId: +this.selectedPartner,
      DeviceType: this.diviceType,
    }
    this.apiService.apiPost(this.configService.getApiUrl, data, true,
      Controllers.CONTENT, Methods.GET_WEBSITE_MENU).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.menus = data.ResponseObject;
      }
    });
  }



  onSubmit() {
    const requestBody = this.formGroup.getRawValue();
    requestBody.ToPartnerId = +this.partnerId;
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true,
      Controllers.CONTENT, Methods.CLONE_WEBSITE_MENU_BY_PARTNER_ID).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
      this.isSendingReqest = false;
    });
  }
}
