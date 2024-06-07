import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../../core/services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {Controllers, Methods} from "../../../../../core/enums";

@Component({
  selector: 'app-add-edit-translation',
  templateUrl: './add-edit-translation.component.html',
  styleUrls: ['./add-edit-translation.component.scss']
})
export class AddEditTranslationComponent implements OnInit {
  partnerId;
  dialogData;
  formGroup: UntypedFormGroup;
  action: string;
  isSendingReqest = false;
  
  constructor(
    public dialogRef: MatDialogRef<AddEditTranslationComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.dialogData = this.data;
    this.action = this.dialogData.action;

    this.createFbForm();
  }

  private createFbForm(): void {
    this.formGroup = this.fb.group({
      Id:[this.dialogData.Id || null],
      Title: [this.dialogData.Title || null, Validators.required],
      Order: [this.dialogData.Order || null, Validators.required],
      InterfaceType: [this.dialogData.interfaceType || null],
    })
  }

  onSubmit() {
    const requestBody = this.formGroup.getRawValue();
    requestBody.PartnerId = this.partnerId;
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.CONTENT,
      Methods.SAVE_ADMIN_TRANSLATION).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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


