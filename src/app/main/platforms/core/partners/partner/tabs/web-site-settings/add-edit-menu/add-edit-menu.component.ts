import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-edit-menu',
  templateUrl: './add-edit-menu.component.html'
})
export class AddEditMenuComponent implements OnInit {
  public partnerId;
  public menu;
  public formGroup: UntypedFormGroup;
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<AddEditMenuComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.menu = this.data;
    this.formValues();
  }

  private formValues() {
    this.formGroup = this.fb.group({
      Id: [this.menu.Id],
      Type: [{value:this.menu.Type, disabled:true}],
      StyleType: [this.menu.StyleType || ''],
    })
  }

  submit() {
    const value = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    value.PartnerId = this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.CONTENT,
      Methods.SAVE_WEBSITE_MENU).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
